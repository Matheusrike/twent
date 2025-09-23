export function Video() {
  return (
    <video
      className="w-auto h-auto"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/video/home/heroVideo.mp4" type="video/mp4" />
      Seu navegador não suporta vídeos em HTML5.
    </video>
  )
}
