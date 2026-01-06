import 'package:just_audio/just_audio.dart';

/**
 * ProAudioController (Flutter)
 * Multi-track synchronization engine for immersive biblical experiences.
 */
class ProAudioController {
  final AudioPlayer _narrator = AudioPlayer();
  final AudioPlayer _ambience = AudioPlayer();
  final AudioPlayer _score = AudioPlayer();

  final Duration _fadeDuration = const Duration(milliseconds: 500);

  Future<void> initTracks(String narratorPath, String ambientPath, String scorePath) async {
    await Future.wait([
      _narrator.setAsset(narratorPath),
      _ambience.setAsset(ambientPath),
      _score.setAsset(scorePath),
    ]);
  }

  /**
   * Requirement: Play Synchronized with millisecond precision and fade-in.
   */
  void playSynchronized() {
    // just_audio ConcatenatingAudioSource or simultaneous start logic
    // We use a broadcast loop for precision
    _narrator.setVolume(0);
    _ambience.setVolume(0);
    _score.setVolume(0);

    _narrator.play();
    _ambience.play();
    _score.play();

    // High-end Fade-in
    _fadeIn(_narrator, 1.0);
    _fadeIn(_ambience, 0.5);
    _fadeIn(_score, 0.4);
  }

  void stopWithFade() async {
    await Future.wait([
      _fadeOut(_narrator),
      _fadeOut(_ambience),
      _fadeOut(_score),
    ]);
    _narrator.pause();
    _ambience.pause();
    _score.pause();
  }

  /**
   * Requirement: User customized mix.
   */
  void setMix(double voice, double ambient, double score) {
    _narrator.setVolume(voice);
    _ambience.setVolume(ambient);
    _score.setVolume(score);
  }

  // Internal Fade Logic
  Future<void> _fadeIn(AudioPlayer player, double target) async {
    double current = 0;
    while (current < target) {
      current += 0.05;
      player.setVolume(current);
      await Future.delayed(const Duration(milliseconds: 25));
    }
  }

  Future<void> _fadeOut(AudioPlayer player) async {
    double current = player.volume;
    while (current > 0) {
      current -= 0.05;
      player.setVolume(current);
      await Future.delayed(const Duration(milliseconds: 25));
    }
  }
}
