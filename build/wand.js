"use strict";
var DIRECTIONS = [90]; // In degrees
// utilities
function setCoordinate(icon, left, top, opacity) {
    icon.style.setProperty("left", left + "px");
    icon.style.setProperty("top", top + "px");
    icon.style.setProperty("opacity", "" + opacity);
}
function ShootIcon(_a) {
    var angle = _a.angle, iconSrc = _a.iconSrc, xCord = _a.xCord, yCord = _a.yCord, offset = _a.offset, jump = _a.jump, speed = _a.speed, initialOpacity = _a.initialOpacity, awakePercentage = _a.awakePercentage;
    var icon = document.createElement("img");
    icon.setAttribute("src", iconSrc);
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.style.setProperty("position", "fixed");
    var top = yCord, left = xCord, opacity = initialOpacity, deltaOpacity = jump / (awakePercentage * 0.01 * yCord);
    setCoordinate(icon, left, top, opacity);
    icon.style.setProperty("transition", "left " + speed + "ms, top " + speed + "ms, opacity " + speed + "ms ease");
    document.body.appendChild(icon);
    var timeout;
    function removeIcon() {
        icon.remove();
        clearInterval(timeout);
    }
    timeout = setInterval(function () {
        if (top < 0 || top > window.innerHeight || left < 0 || left > window.innerWidth) {
            removeIcon();
        }
        var newTop = jump * Math.sin(angle) + top, newLeft = ((newTop - top) / Math.tan(angle)) + left + (offset * (offset % 2 ? -1 : 1));
        top = newTop;
        left = newLeft;
        opacity = Math.max(opacity - deltaOpacity, 0);
        if (opacity <= 0) {
            removeIcon();
        }
        setCoordinate(icon, left, top, opacity);
    }, speed);
}
function Wand(_a) {
    var targetSelector = _a.targetSelector, iconSrc = _a.iconSrc;
    var target = document.querySelector(targetSelector);
    if (target == null)
        return;
    var ctr = 0;
    var timeout = null;
    document.body.onmousemove = function () {
        if (timeout) {
            return;
        }
        timeout = setTimeout(function () {
            var count = 10;
            while (count--) {
                ShootIcon({
                    direction: DIRECTIONS[0],
                    iconSrc: iconSrc,
                    offset: count / 3,
                    xCord: target.offsetLeft,
                    yCord: target.offsetTop,
                    angle: 10,
                    jump: 4,
                    speed: 30,
                    initialOpacity: 1,
                    awakePercentage: 50
                });
            }
            timeout = null;
        }, 700);
    };
}
