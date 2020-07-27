import { css } from 'lit-element';

export const styles = css`
:host {
  -webkit-tap-highlight-color: transparent;
  display: block;
  position: relative; }
.style-root {
  position: absolute;
  cursor: pointer; 
  fill: var(--applause-button-color, rgb(79,177,186));
  stroke: var(--applause-button-color, rgb(79,177,186));
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; }
  // .style-root:after {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   content: " ";
  //   display: block;
  //   border-radius: 50%;
  //   opacity: 0.5;
  //   border: 1px solid; }
  .style-root:hover:after:not(.clap-limit-exceeded) {
    border-color: inherit; }
  .style-root.loading {
    cursor: default; }
  .style-root .shockwave {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--applause-button-color, rgb(79,177,186));
    border-radius: 50%; }
  .style-root svg {
    position: absolute;
    width: 60%;
    height: 60%;
    margin: 20%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
    stroke: none;
    overflow: visible !important; }
    // .style-root svg g.flat, .style-root svg g.outline {
    //   transform: translate(3px, 2px); }
    .style-root svg g.flat {
      visibility: hidden; }
    .style-root svg g.outline {
      visibility: visible; }
  .style-root.clapped svg g.flat {
    visibility: visible; }
  .style-root.clapped svg g.outline {
    visibility: hidden; }
  .style-root .count-container {
    position: absolute;
    top: -50%;
    width: 100%;
    color: gray;
    // font-weight: bold;
    user-select: none; }
    .style-root .count-container .count {
      text-align: center; }
  .style-root g.sparkle circle {
    opacity: 0;
    stroke-width: 0; }
  .style-root:hover:not(.clapped) .shockwave {
    animation-name: shockwave;
    animation-duration: 1.25s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in; }
  .style-root.clap {
    animation-name: pulse;
    animation-duration: 0.5s;
    animation-iteration-count: 1; 
    animation-timing-function: ease-out; }
    .style-root.clap .sparkle circle {
      animation-name: explode;
      animation-duration: 0.5s;
      animation-iteration-count: 1; }
    .style-root.clap .count {
      animation-name: hideThenShow;
      animation-duration: 0.5s;
      animation-iteration-count: 1; }

#hand-svg {
  margin-top: 22%;
  margin-left: 22%; }
#countdown-svg {
  width: 100%;
  height: 100%;
  stroke: var(--applause-button-color, rgb(79,177,186));
  margin: 0; }

.countdown {
  fill: none; 
  transform: rotateZ(0deg);
  transform-origin: center; }

.countdown circle {
  stroke-width: 1px;
  opacity: 1;
  stroke-linecap: round;
  stroke-dasharray: 308 308;
  transform: rotate(-90deg);
  transform-origin: center; }

.style-root.count .countdown circle {
  animation-timing-function: linear;
  animation-name: countdown;
  animation-duration: 2s; }

.style-root.loading .countdown {
  animation: 2s linear infinite svg-animation; }
.style-root.loading .countdown circle {
  animation: 1.4s ease-in-out infinite both circle-animation;
  stroke-dasharray: 308;
  stroke-dashoffset: 302; }

@keyframes svg-animation {
  0% {
    transform: rotateZ(-90deg); }
  100% {
    transform: rotateZ(270deg); } }

@keyframes circle-animation {
  0%,
  15% {
    stroke-dashoffset: 280;
    transform: rotate(0); }
  50%,
  65% {
    stroke-dashoffset: 75;
    transform: rotate(45deg); }
  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg); } }

@keyframes countdown {
  0% {
    stroke-dasharray: 308 308; }
  33% {
    stroke-dasharray: 308 308; }
  100% {
    stroke-dasharray: 0 308; } }

@keyframes explode {
  0% {
    transform: translateX(10px);
    opacity: 0; }
  50% {
    opacity: 1; }
  100% {
    opacity: 0;
    transform: translateX(25px); } }

@keyframes shockwave {
  0% {
    transform: scale(1);
    opacity: 1; 
    box-shadow: 0 0 2px, inset 0 0 1px; }
  89.9% {
    transform: scale(1);
    opacity: 0;
    box-shadow: 0 0 50px, inset 0 0 10px; }
  90%, 100% {
    transform: scale(1);
    opacity: 0;
    box-shadow: 0 0 2px, inset 0 0 1px; } }

@keyframes pulse {
  0% {
    transform: scale(1); }
  25% {
    transform: scale(1.1); }
  100% {
    transform: scale(1); } }

@keyframes hideThenShow {
  0% {
    opacity: 1;
    transform: translateY(0); }
  20% {
    opacity: 0;
    transform: translateY(-10px); }
  50% {
    transform: translateY(10px); }
  80% {
    transform: translateY(10px);
    opacity: 0; }
  100% {
    opacity: 1;
    transform: translateY(0); } }
`;
