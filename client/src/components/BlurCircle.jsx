const BlurCircle = ({top = "auto", left = "auto", right = "auto", bottom = "auto"}) => {
  return (
    <div
      className="absolute -z-50 rounded-full bg-gradient-to-tr from-[rgba(127,0,255,0.16)] to-[rgba(0,240,255,0.06)] blur-3xl transform-gpu"
      style={{ top: top, left: left, right: right, bottom: bottom, width: '14rem', height: '14rem' }}>
    </div>
  )
}

export default BlurCircle
