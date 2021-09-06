const DIRECTIONS : number[] = [90]; // In degrees

// types
type ShootIconParams = {
  direction: number,
  offset: number,
  iconSrc: string,
  xCord: number,
  yCord: number,
  angle: number,
  jump: number,
  speed: number,
  initialOpacity: number,
  finalOpacity: number,
  awakePercentage: number
}

// utilities
function setCoordinate(icon: HTMLElement, left: number, top: number, opacity: number) {
  icon.style.setProperty("left", `${left}px`);
  icon.style.setProperty("top", `${top}px`);
  icon.style.setProperty("opacity", `${opacity}`);
}

function toRadians (angle: number) {
  return angle * (Math.PI / 180);
}

function ShootIcon({
  angle,
  iconSrc,
  xCord,
  yCord,
  offset,
  jump,
  speed,
  initialOpacity, awakePercentage, finalOpacity
}: ShootIconParams){
  const icon: HTMLElement = document.createElement("img");

  icon.setAttribute("src", iconSrc);
  icon.setAttribute("width", "16");
  icon.setAttribute("height", "16");
  icon.style.setProperty("position", "fixed")

  let top: number = yCord, left: number = xCord, opacity = initialOpacity, deltaOpacity = (jump * (initialOpacity - finalOpacity)) / (awakePercentage * 0.01 * yCord);

  setCoordinate(icon, left, top, opacity);
  icon.style.setProperty("transition", `left ${speed}ms, top ${speed}ms, opacity ${speed}ms ease`)

  document.body.appendChild(icon);

  // let timeout: number;

  function removeIcon() {
    icon.remove();
    // clearInterval(timeout)
  }

  // timeout = setInterval(
  const handleMovement = () => {
    if(top < 0 || top > window.innerHeight || left < 0 || left > window.innerWidth) {
      removeIcon();
      return;
    }

    const newTop: number = jump * Math.sin(toRadians(angle)) + top, newLeft:number = (( newTop - top ) / Math.tan(toRadians(angle))) + left + offset;

    top = newTop;
    left = newLeft;
    opacity = Math.max(opacity - deltaOpacity, 0);

    if(opacity <= 0){
      removeIcon();
      return;
    }

    setCoordinate(icon, left, top, opacity);
    window.requestAnimationFrame(handleMovement);
  }
  window.requestAnimationFrame(handleMovement);
  // , speed)
}

function Wand({ targetSelector, iconSrc, event }: { targetSelector: string, iconSrc: string, event: string | undefined }) {
  const target: HTMLElement | null = document.querySelector(targetSelector);

  if(target == null) return;

  function handleShoot() {
    if(target === null){
      return;
    }

    let count = 1;
    while(count--){
      ShootIcon({
        direction: DIRECTIONS[0],
        iconSrc,
        offset: count / 3,
        xCord: target.offsetLeft,
        yCord: target.offsetTop,
        angle: 270,
        jump: 4,
        speed: 30,
        initialOpacity: 0,
        finalOpacity: 1,
        awakePercentage: 50
      })
    }
  }

  function start() {
    handleShoot();
  }

  if(event){
    target.addEventListener(event, function () {
      start();
    });
  }

  return {
    start
  }
}
