(() => {
  const film = document.querySelector('.film');
  const video = film?.querySelector('video');
  const music = film?.querySelector('[data-film-music]');
  let soundEnabled = false;
  let musicStarting = false;
  let musicAttempt = 0;
  const seek = film?.querySelector('#seek');
  const bar = film?.querySelector('.film-bar');
  if (!video || !seek || !bar) return;
  const play = bar.querySelector('[data-act="play"]');
  const mute = bar.querySelector('[data-act="mute"]');
  const back = bar.querySelector('[data-act="back"]');
  const forward = bar.querySelector('[data-act="forward"]');
  const time = bar.querySelector('.film-time bdi');
  let scrubbing = false;
  let activePointer = null;
  let previewTime = null;
  let controlsTimer;
  let keyboardControls = false;
  function hideControls() {
    clearTimeout(controlsTimer);
    if (scrubbing || (keyboardControls && bar.contains(document.activeElement))) return;
    film.classList.remove('controls-visible');
  }
  function showControls() {
    clearTimeout(controlsTimer);
    film.classList.add('controls-visible');
    controlsTimer = setTimeout(hideControls, 2500);
  }
  film.addEventListener('pointerenter', showControls);
  film.addEventListener('pointermove', showControls);
  film.addEventListener('pointerdown', () => { keyboardControls = false; showControls(); }, {capture: true});
  film.addEventListener('pointerup', showControls);
  film.addEventListener('pointerleave', hideControls);
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') keyboardControls = true;
  });
  bar.addEventListener('keydown', () => { keyboardControls = true; showControls(); });
  bar.addEventListener('focusin', showControls);
  bar.addEventListener('focusout', () => { clearTimeout(controlsTimer); controlsTimer = setTimeout(hideControls, 0); });
  const duration = () => Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
  const format = value => {
    const seconds = Math.max(0, Math.floor(value || 0));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };
  function sync() {
    const total = duration();
    const current = Math.min(total, previewTime ?? (video.currentTime || 0));
    bar.querySelector('[data-s="playing"]').classList.toggle('off', video.paused);
    bar.querySelector('[data-s="paused"]').classList.toggle('off', !video.paused);
    bar.querySelector('[data-s="muted"]').classList.toggle('off', soundEnabled);
    bar.querySelector('[data-s="sound"]').classList.toggle('off', !soundEnabled);
    play.setAttribute('aria-label', video.paused ? 'ניגון הסרט' : 'השהיית הסרט');
    mute.setAttribute('aria-label', !soundEnabled ? 'הפעלת קול' : 'השתקת קול');
    mute.setAttribute('aria-pressed', String(soundEnabled));
    const soundLabel = mute.querySelector('.film-sound-label');
    if (soundLabel) soundLabel.textContent = mute.getAttribute('aria-label');
    play.title = play.getAttribute('aria-label');
    mute.title = mute.getAttribute('aria-label');
    seek.disabled = back.disabled = forward.disabled = !total;
    seek.max = String(total || 1);
    if (!scrubbing) seek.value = String(current);
    seek.style.setProperty('--p', `${total ? Number(seek.value) / total * 100 : 0}%`);
    seek.setAttribute('aria-valuetext', `${format(current)} מתוך ${format(total)}`);
    time.textContent = `${format(current)} / ${format(total)}`;
  }
  // The original video track stays muted on desktop and iOS alike.
  // This soundtrack follows the same transport, seek and loop controls.
  function alignMusic() {
    if (music && music.readyState && Math.abs(music.currentTime - video.currentTime) > .35) {
      music.currentTime = Math.min(video.currentTime, music.duration || video.currentTime);
    }
  }
  function stopMusic() {
    musicAttempt++;
    musicStarting = false;
    music?.pause();
  }
  function playMusic(fromGesture = false) {
    if (!music || !soundEnabled || (!fromGesture && (video.paused || video.ended || video.seeking))) return;
    alignMusic();
    if (!music.paused || (musicStarting && !fromGesture)) return;
    musicStarting = true;
    const attemptId = ++musicAttempt;
    // Call play directly during the tap, even if the video is still loading
    // or seeking. iOS cannot unlock audio from a later "playing" event.
    const attempt = music.play();
    if (attempt?.then) attempt.catch(() => {
      if (attemptId === musicAttempt && soundEnabled && !video.paused && !video.seeking) {
        soundEnabled = false;
        stopMusic();
        sync();
      }
    }).finally(() => { if (attemptId === musicAttempt) musicStarting = false; });
    else musicStarting = false;
  }
  if (music) {
    video.muted = true;
    video.addEventListener('volumechange', () => { if (!video.muted) video.muted = true; });
    ['pause', 'waiting', 'seeking', 'emptied', 'ended'].forEach(event => video.addEventListener(event, stopMusic));
    ['playing', 'seeked'].forEach(event => video.addEventListener(event, () => { alignMusic(); playMusic(); }));
    video.addEventListener('timeupdate', alignMusic);
    video.addEventListener('ratechange', () => { music.playbackRate = video.playbackRate; });
    music.addEventListener('loadedmetadata', alignMusic);
    music.addEventListener('error', () => { soundEnabled = false; stopMusic(); sync(); });
  }
  function start(fromGesture = false) {
    const attempt = video.play();
    if (attempt?.catch) attempt.catch(() => { stopMusic(); sync(); });
    playMusic(fromGesture);
  }
  function seekTo(target) {
    const total = duration();
    if (!total) return;
    const point = Math.max(0, Math.min(total, target));
    if (point === total) video.pause();
    video.currentTime = point;
    sync();
  }
  play.addEventListener('click', () => video.paused ? start(true) : video.pause());
  mute.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) start(true);
    else stopMusic();
    sync();
  });
  back.addEventListener('click', () => seekTo(video.currentTime - 10));
  forward.addEventListener('click', () => seekTo(video.currentTime + 10));
  // Touch dragging previews a timestamp, then commits one seek on release.
  // Prevent native range handling from racing with media timeupdate events.
  function previewAt(clientX) {
    const bounds = seek.getBoundingClientRect();
    const track = Math.max(1, bounds.width - 8);
    const ratio = Math.max(0, Math.min(1, (clientX - bounds.left - 4) / track));
    previewTime = ratio * duration();
    seek.value = String(previewTime);
    sync();
  }
  seek.addEventListener('pointerdown', event => {
    if (seek.disabled || (event.button !== 0 && event.pointerType === 'mouse') || activePointer !== null) return;
    event.preventDefault();
    activePointer = event.pointerId;
    scrubbing = true;
    video.pause();
    seek.focus({preventScroll: true});
    seek.setPointerCapture(event.pointerId);
    previewAt(event.clientX);
  });
  seek.addEventListener('pointermove', event => {
    if (event.pointerId !== activePointer) return;
    previewAt(event.clientX);
  });
  function finishScrub(event) {
    if (activePointer === null || event.pointerId !== activePointer) return;
    const target = previewTime;
    activePointer = null;
    if (seek.hasPointerCapture(event.pointerId)) seek.releasePointerCapture(event.pointerId);
    if (target !== null) seekTo(target);
    previewTime = null;
    scrubbing = false;
    sync();
  }
  seek.addEventListener('pointerup', finishScrub);
  seek.addEventListener('pointercancel', finishScrub);
  seek.addEventListener('lostpointercapture', finishScrub);
  seek.addEventListener('input', () => {
    if (activePointer !== null) return;
    const target = Number(seek.value);
    scrubbing = true;
    video.pause();
    seekTo(target);
  });
  seek.addEventListener('change', () => {
    if (activePointer !== null) return;
    const target = Number(seek.value);
    scrubbing = false;
    seekTo(target);
  });
  seek.addEventListener('blur', () => {
    if (activePointer !== null) finishScrub({pointerId: activePointer});
    scrubbing = false;
    sync();
  });
  ['timeupdate', 'play', 'pause', 'volumechange', 'loadedmetadata', 'durationchange', 'emptied', 'ended', 'seeked'].forEach(event => video.addEventListener(event, sync));
  if (matchMedia('(max-width: 700px)').matches && video.dataset.msrc) {
    video.poster = video.dataset.mposter;
    video.src = video.dataset.msrc;
  }
  video.controls = false;
  bar.hidden = false;
  showControls();
  sync();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
  else start();
})();
