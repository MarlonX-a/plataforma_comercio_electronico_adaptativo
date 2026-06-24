export type MediaDetectionResult = {
  mediaCount: number;
  videoCount: number;
  audioCount: number;
  captionsTrackCount: number;
  descriptionTrackCount: number;
  transcriptCount: number;
};

const transcriptSelector = '.transcripcion, .transcript, [data-transcript]';

const getMediaElements = (): Array<HTMLAudioElement | HTMLVideoElement> =>
  Array.from(document.querySelectorAll<HTMLAudioElement | HTMLVideoElement>('audio, video'));

export const detectMediaElements = (): MediaDetectionResult => {
  const mediaElements = getMediaElements();
  const videos = mediaElements.filter(
    (mediaElement): mediaElement is HTMLVideoElement => mediaElement instanceof HTMLVideoElement,
  );
  const audios = mediaElements.filter(
    (mediaElement): mediaElement is HTMLAudioElement => mediaElement instanceof HTMLAudioElement,
  );
  const tracks = Array.from(document.querySelectorAll<HTMLTrackElement>('track'));

  return {
    mediaCount: mediaElements.length,
    videoCount: videos.length,
    audioCount: audios.length,
    captionsTrackCount: tracks.filter(
      (track) => track.kind === 'captions' || track.kind === 'subtitles',
    ).length,
    descriptionTrackCount: tracks.filter((track) => track.kind === 'descriptions').length,
    transcriptCount: document.querySelectorAll(transcriptSelector).length,
  };
};

const updateTextTracks = (enabled: boolean, acceptedKinds: string[]): void => {
  getMediaElements().forEach((mediaElement) => {
    Array.from(mediaElement.textTracks).forEach((textTrack) => {
      if (!acceptedKinds.includes(textTrack.kind)) {
        return;
      }

      textTrack.mode = enabled ? 'showing' : 'disabled';
    });
  });
};

export const toggleCaptions = (enabled: boolean): void => {
  updateTextTracks(enabled, ['captions', 'subtitles']);
};

export const toggleAudioDescriptions = (enabled: boolean): void => {
  updateTextTracks(enabled, ['descriptions']);
};

export const toggleTranscripts = (enabled: boolean): void => {
  document.querySelectorAll<HTMLElement>(transcriptSelector).forEach((transcriptElement) => {
    transcriptElement.hidden = !enabled;
    transcriptElement.dataset.transcriptVisible = String(enabled);
  });
};

export const muteAllMedia = (enabled: boolean): void => {
  getMediaElements().forEach((mediaElement) => {
    mediaElement.muted = enabled;

    if (enabled && mediaElement instanceof HTMLAudioElement) {
      mediaElement.pause();
    }
  });
};
