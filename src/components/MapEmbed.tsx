export function MapEmbed() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-elegant border border-border">
      <iframe
        width="100%"
        height="400"
        frameBorder="0"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3206.3850737625457!2d10.299!3d36.848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130254e7e6f5d5d7%3A0x123456789abcdef0!2sMenzel%20Temime!5e0!3m2!1sfr!2stn!4v1234567890"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
