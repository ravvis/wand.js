"use strict";
var DIRECTIONS = [90]; // In degrees
// utilities
function setCoordinate(icon, left, top, opacity) {
    icon.style.setProperty("left", left + "px");
    icon.style.setProperty("top", top + "px");
    icon.style.setProperty("opacity", "" + opacity);
}
function toRadians(angle) {
    return angle * (Math.PI / 180);
}
function ShootIcon(_a) {
    var angle = _a.angle, iconSrc = _a.iconSrc, xCord = _a.xCord, yCord = _a.yCord, offset = _a.offset, jump = _a.jump, speed = _a.speed, initialOpacity = _a.initialOpacity, awakePercentage = _a.awakePercentage, finalOpacity = _a.finalOpacity;
    var icon = document.createElement("img");
    icon.setAttribute("src", iconSrc);
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.style.setProperty("position", "fixed");
    var top = yCord, left = xCord, opacity = initialOpacity, deltaOpacity = (jump * (initialOpacity - finalOpacity)) / (awakePercentage * 0.01 * yCord);
    setCoordinate(icon, left, top, opacity);
    icon.style.setProperty("transition", "left " + speed + "ms, top " + speed + "ms, opacity " + speed + "ms ease");
    document.body.appendChild(icon);
    // let timeout: number;
    function removeIcon() {
        icon.remove();
        // clearInterval(timeout)
    }
    // timeout = setInterval(
    var handleMovement = function () {
        if (top < 0 || top > window.innerHeight || left < 0 || left > window.innerWidth) {
            removeIcon();
            return;
        }
        var newTop = jump * Math.sin(toRadians(angle)) + top, newLeft = ((newTop - top) / Math.tan(toRadians(angle))) + left + offset;
        top = newTop;
        left = newLeft;
        opacity = Math.max(opacity - deltaOpacity, 0);
        if (opacity <= 0) {
            removeIcon();
            return;
        }
        setCoordinate(icon, left, top, opacity);
        window.requestAnimationFrame(handleMovement);
    };
    window.requestAnimationFrame(handleMovement);
    // , speed)
}
function Wand(_a) {
    var targetSelector = _a.targetSelector, iconSrc = _a.iconSrc, event = _a.event;
    var target = document.querySelector(targetSelector);
    if (target == null)
        return;
    function handleShoot() {
        if (target === null) {
            return;
        }
        var count = 1;
        while (count--) {
            ShootIcon({
                direction: DIRECTIONS[0],
                iconSrc: iconSrc,
                offset: count / 3,
                xCord: target.offsetLeft,
                yCord: target.offsetTop,
                angle: 270,
                jump: 4,
                speed: 30,
                initialOpacity: 0,
                finalOpacity: 1,
                awakePercentage: 50
            });
        }
    }
    function start() {
        handleShoot();
    }
    if (event) {
        target.addEventListener(event, function () {
            start();
        });
    }
    return {
        start: start
    };
}
