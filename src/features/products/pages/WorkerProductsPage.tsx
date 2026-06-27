import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  FaBoxesStacked,
  FaCirclePlus,
  FaPenToSquare,
  FaRotateLeft,
  FaStore,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Alert from '../../../components/ui/Alert';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Select from '../../../components/ui/Select';
import { getCurrentAuthSession, getUserProfile } from '../../auth/services/authService';
import type { AuthSession, UserProfile } from '../../auth/types/auth.types';
import {
  canManageProducts,
  createManagedProduct,
  emptyProductManagementFormValues,
  getManageableProducts,
  mapProductToManagementForm,
  updateManagedProduct,
  validateProductManagementForm,
} from '../services/productManagementService';
import type {
  Product,
  ProductManagementFieldErrors,
  ProductManagementFormValues,
  ProductServiceResult,
} from '../types/product.types';
import { formatProductPrice } from '../utils/productFormatters';
import styles from './WorkerProductsPage.module.css';

const productStatusOptions = [
  { value: 'active', label: 'Publicado' },
  { value: 'inactive', label: 'Oculto' },
] as const;

const createEmptyProductResult = (): ProductServiceResult => ({
  isSuccess: true,
  products: [],
});

export default function WorkerProductsPage() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accessMessage, setAccessMessage] = useState('');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsResult, setProductsResult] = useState<ProductServiceResult>(
    createEmptyProductResult,
  );
  const [formValues, setFormValues] = useState<ProductManagementFormValues>(
    emptyProductManagementFormValues,
  );
  const [fieldErrors, setFieldErrors] = useState<ProductManagementFieldErrors>({});
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isErrorStatus, setIsErrorStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const products = useMemo(
    () => (productsResult.isSuccess ? productsResult.products : []),
    [productsResult],
  );

  const inventorySummary = useMemo(() => {
    const activeProducts = products.filter((product) => product.isActive).length;
    const hiddenProducts = products.length - activeProducts;
    const totalStock = products.reduce((total, product) => total + (product.stock ?? 0), 0);

    return {
      activeProducts,
      hiddenProducts,
      totalProducts: products.length,
      totalStock,
    };
  }, [products]);

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const result = await getManageableProducts();
    setProductsResult(result);
    setIsLoadingProducts(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      const session = await getCurrentAuthSession();

      if (!isMounted) {
        return;
      }

      setAuthSession(session);

      if (!session) {
        setAccessMessage('Inicia sesion con una cuenta de vendedor para agregar y administrar productos.');
        setIsCheckingAccess(false);
        return;
      }

      const profile = await getUserProfile(session.userId);

      if (!isMounted) {
        return;
      }

      setUserProfile(profile);

      if (!canManageProducts(profile?.role)) {
        setAccessMessage('Tu cuenta no tiene permisos de vendedor para agregar o gestionar productos.');
        setIsCheckingAccess(false);
        return;
      }

      setAccessMessage('');
      setIsCheckingAccess(false);
      void loadProducts();
    };

    void verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [loadProducts]);

  const updateFormValue = (
    fieldName: keyof ProductManagementFormValues,
    value: string | boolean,
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormValues(emptyProductManagementFormValues);
    setFieldErrors({});
    setStatusMessage('');
    setIsErrorStatus(false);
  };

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setFormValues(mapProductToManagementForm(product.id, productsResult));
    setFieldErrors({});
    setStatusMessage(`Editando ${product.name}.`);
    setIsErrorStatus(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateProductManagementForm(formValues);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatusMessage('Corrige los campos marcados antes de guardar.');
      setIsErrorStatus(true);
      return;
    }

    setIsSaving(true);

    const result =
      editingProductId === null
        ? await createManagedProduct(formValues)
        : await updateManagedProduct(editingProductId, formValues);

    setIsSaving(false);
    setStatusMessage(result.message);
    setIsErrorStatus(!result.isSuccess);

    if (!result.isSuccess) {
      return;
    }

    setEditingProductId(null);
    setFormValues(emptyProductManagementFormValues);
    setFieldErrors({});
    await loadProducts();
  };

  if (isCheckingAccess) {
    return (
      <section className={styles.page} aria-labelledby="worker-products-title">
        <LoadingSpinner label="Verificando permisos de vendedor" />
      </section>
    );
  }

  if (!authSession || !canManageProducts(userProfile?.role)) {
    return (
      <section className={styles.page} aria-labelledby="worker-products-title">
        <div className={styles.accessCard}>
          <FaStore aria-hidden="true" />
          <h1 id="worker-products-title">Panel de vendedor</h1>
          <p>{accessMessage}</p>
          <Link to={authSession ? '/' : '/login'}>
            {authSession ? 'Volver al inicio' : 'Iniciar sesión'}
          </Link>
        </div>
      </section>
    );
  }

  const sellerRole = userProfile?.role === 'admin' ? 'admin' : 'seller';

  return (
    <section className={styles.page} aria-labelledby="worker-products-title">
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Gestion de tienda</p>
          <h1 id="worker-products-title">Panel de vendedor</h1>
          <p>
            Agrega productos, actualiza inventario y decide que articulos se muestran en la tienda.
          </p>
        </div>
        <Badge variant={sellerRole === 'admin' ? 'primary' : 'success'}>
          {sellerRole === 'admin' ? 'Administrador' : 'Vendedor'}
        </Badge>
      </header>

      <div className={styles.statsGrid} aria-label="Resumen del inventario">
        <article>
          <span>{inventorySummary.totalProducts}</span>
          <p>Productos registrados</p>
        </article>
        <article>
          <span>{inventorySummary.activeProducts}</span>
          <p>Publicados</p>
        </article>
        <article>
          <span>{inventorySummary.hiddenProducts}</span>
          <p>Ocultos</p>
        </article>
        <article>
          <span>{inventorySummary.totalStock}</span>
          <p>Unidades en stock</p>
        </article>
      </div>

      <div className={styles.layout}>
        <form className={styles.formCard} aria-labelledby="product-form-title" onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <FaCirclePlus aria-hidden="true" />
            <div>
              <h2 id="product-form-title">
                {editingProductId === null ? 'Agregar producto' : 'Editar producto'}
              </h2>
              <p>Los campos con nombre, precio y stock son obligatorios.</p>
            </div>
          </div>

          <Input
            id="product-name"
            name="name"
            label="Nombre del producto"
            placeholder="Ejemplo: Monitor gamer 144 Hz"
            autoComplete="off"
            value={formValues.name}
            error={fieldErrors.name}
            onChange={(event) => updateFormValue('name', event.target.value)}
          />

          <div className={styles.field}>
            <label htmlFor="product-description">Descripción</label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              placeholder="Describe el producto con información clara para el cliente."
              value={formValues.description}
              onChange={(event) => updateFormValue('description', event.target.value)}
            />
          </div>

          <div className={styles.twoColumns}>
            <Input
              id="product-price"
              name="price"
              label="Precio"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ejemplo: 49.99"
              inputMode="decimal"
              value={formValues.price}
              error={fieldErrors.price}
              onChange={(event) => updateFormValue('price', event.target.value)}
            />

            <Input
              id="product-stock"
              name="stock"
              label="Stock"
              type="number"
              min="0"
              step="1"
              placeholder="Ejemplo: 20"
              inputMode="numeric"
              value={formValues.stock}
              error={fieldErrors.stock}
              onChange={(event) => updateFormValue('stock', event.target.value)}
            />
          </div>

          <Input
            id="product-category"
            name="category"
            label="Categoría"
            placeholder="Ejemplo: Tecnología"
            autoComplete="off"
            value={formValues.category}
            onChange={(event) => updateFormValue('category', event.target.value)}
          />

          <Input
            id="product-image-url"
            name="imageUrl"
            label="URL de imagen"
            type="url"
            placeholder="https://ejemplo.com/producto.png"
            autoComplete="url"
            value={formValues.imageUrl}
            error={fieldErrors.imageUrl}
            onChange={(event) => updateFormValue('imageUrl', event.target.value)}
          />

          <Select
            id="product-status"
            name="status"
            label="Estado en tienda"
            value={formValues.isActive ? 'active' : 'inactive'}
            onChange={(event) => updateFormValue('isActive', event.target.value === 'active')}
          >
            {productStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {statusMessage ? (
            <Alert variant={isErrorStatus ? 'error' : 'success'}>{statusMessage}</Alert>
          ) : null}

          <div className={styles.formActions}>
            <Button
              type="submit"
              isLoading={isSaving}
              loadingLabel="Guardando producto"
              leadingIcon={editingProductId === null ? <FaCirclePlus /> : <FaPenToSquare />}
            >
              {editingProductId === null ? 'Agregar producto' : 'Guardar cambios'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              leadingIcon={<FaRotateLeft />}
              onClick={resetForm}
            >
              Limpiar
            </Button>
          </div>
        </form>

        <section className={styles.inventoryCard} aria-labelledby="inventory-title">
          <div className={styles.inventoryHeader}>
            <div>
              <p className={styles.kicker}>Inventario</p>
              <h2 id="inventory-title">Productos de la tienda</h2>
            </div>
            <Button type="button" variant="secondary" size="small" onClick={() => void loadProducts()}>
              Actualizar
            </Button>
          </div>

          {isLoadingProducts ? <LoadingSpinner label="Cargando inventario" /> : null}

          {!isLoadingProducts && !productsResult.isSuccess ? (
            <Alert variant="error">{productsResult.message}</Alert>
          ) : null}

          {!isLoadingProducts && productsResult.isSuccess && products.length === 0 ? (
            <div className={styles.emptyInventory}>
              <FaBoxesStacked aria-hidden="true" />
              <p>No hay productos registrados todavía.</p>
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className={styles.tableWrapper} tabIndex={0}>
              <table>
                <caption>Listado de productos administrables</caption>
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">
                        <span>{product.name}</span>
                        <small>{product.category ?? 'Sin categoría'}</small>
                      </th>
                      <td>{formatProductPrice(product.price)}</td>
                      <td>{product.stock ?? 0}</td>
                      <td>
                        <Badge variant={product.isActive ? 'success' : 'warning'}>
                          {product.isActive ? 'Publicado' : 'Oculto'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          leadingIcon={<FaPenToSquare />}
                          onClick={() => startEditingProduct(product)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
