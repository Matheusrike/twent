export function Video() {
  return (
    <div>
      <video
        className="w-auto h-auto hidden md:flex"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/home/heroVideo.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos em HTML5.
      </video>

      <video
        className="w-auto h-auto flex md:hidden"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/home/heroVideoMobile.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos em HTML5.
      </video>
    </div>
  )
}


