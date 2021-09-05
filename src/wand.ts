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
  awakePercentage: number
}

// utilities
function setCoordinate(icon: HTMLElement, left: number, top: number, opacity: number) {
  icon.style.setProperty("left", `${left}px`);
  icon.style.setProperty("top", `${top}px`);
  icon.style.setProperty("opacity", `${opacity}`);
}

function ShootIcon({
  angle,
  iconSrc,
  xCord,
  yCord,
  offset,
  jump,
  speed,
  initialOpacity, awakePercentage
}: ShootIconParams){
  const icon: HTMLElement = document.createElement("img");

  icon.setAttribute("src", iconSrc);
  icon.setAttribute("width", "16");
  icon.setAttribute("height", "16");
  icon.style.setProperty("position", "fixed")

  let top: number = yCord, left: number = xCord, opacity = initialOpacity, deltaOpacity = jump / (awakePercentage * 0.01 * yCord);

  setCoordinate(icon, left, top, opacity);
  icon.style.setProperty("transition", `left ${speed}ms, top ${speed}ms, opacity ${speed}ms ease`)

  document.body.appendChild(icon);

  let timeout: number;

  function removeIcon() {
    icon.remove();
    clearInterval(timeout)
  }

  timeout = setInterval(() => {
    if(top < 0 || top > window.innerHeight || left < 0 || left > window.innerWidth) {
      removeIcon();
    }

    const newTop: number = jump * Math.sin(angle) + top,
      newLeft:number = (( newTop - top ) / Math.tan(angle)) + left + (offset * (offset % 2 ? -1 : 1));

    top = newTop;
    left = newLeft;
    opacity = Math.max(opacity - deltaOpacity, 0);

    if(opacity <= 0){
      removeIcon();
    }

    setCoordinate(icon, left, top, opacity);
  }, speed)
}

function Wand({ targetSelector, iconSrc }: { targetSelector: string, iconSrc: string }) {
  const target: HTMLElement | null = document.querySelector(targetSelector);

  if(target == null) return;
  let ctr = 0;

  let timeout: number | null = null;

  document.body.onmousemove = function () {
    if(timeout){
      return;
    }

    timeout = setTimeout(() => {
      let count = 10;
      while(count--){
        ShootIcon({
          direction: DIRECTIONS[0],
          iconSrc,
          offset: count / 3,
          xCord: target.offsetLeft,
          yCord: target.offsetTop,
          angle: 10,
          jump: 4,
          speed: 30,
          initialOpacity: 1,
          awakePercentage: 50
        })
      }
      timeout = null;
    }, 700)
  }
}
