import React from "react";
import { ThemeContext } from "styled-components";

interface IIconProps {
  size?: string;
  color?: string;
}

export function TelegramIcon(props: IIconProps) {
  const theme = React.useContext(ThemeContext);
  const { size = "24px", color = theme.global.palette.Grey } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="1.41421"
    >
      <path
        fill={theme.global.colors[color] || color}
        id="telegram-4"
        d="M12,0c-6.626,0 -12,5.372 -12,12c0,6.627 5.374,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.628 -5.373,-12 -12,-12Zm3.224,17.871c0.188,0.133 0.43,0.166 0.646,0.085c0.215,-0.082 0.374,-0.267 0.422,-0.491c0.507,-2.382 1.737,-8.412 2.198,-10.578c0.035,-0.164 -0.023,-0.334 -0.151,-0.443c-0.129,-0.109 -0.307,-0.14 -0.465,-0.082c-2.446,0.906 -9.979,3.732 -13.058,4.871c-0.195,0.073 -0.322,0.26 -0.316,0.467c0.007,0.206 0.146,0.385 0.346,0.445c1.381,0.413 3.193,0.988 3.193,0.988c0,0 0.847,2.558 1.288,3.858c0.056,0.164 0.184,0.292 0.352,0.336c0.169,0.044 0.348,-0.002 0.474,-0.121c0.709,-0.669 1.805,-1.704 1.805,-1.704c0,0 2.084,1.527 3.266,2.369Zm-6.423,-5.062l0.98,3.231l0.218,-2.046c0,0 3.783,-3.413 5.941,-5.358c0.063,-0.057 0.071,-0.153 0.019,-0.22c-0.052,-0.067 -0.148,-0.083 -0.219,-0.037c-2.5,1.596 -6.939,4.43 -6.939,4.43Z"
      />
    </svg>
  );
}

export function DiscordIcon(props: IIconProps) {
  const theme = React.useContext(ThemeContext);
  const { size = "24px", color = theme.global.palette.Grey } = props;

  return (
    <svg
      width={size}
      height={size}
      enableBackground="new 0 0 512 512"
      viewBox="0 0 512 512"
    >
      <circle
        cx="256"
        cy="256"
        fill={theme.global.colors[color] || color}
        id="ellipse"
        r="256"
      />
      <path
        d="M372.4,168.7c0,0-33.3-26.1-72.7-29.1l-3.5,7.1c35.6,8.7,51.9,21.2,69,36.5  c-29.4-15-58.5-29.1-109.1-29.1s-79.7,14.1-109.1,29.1c17.1-15.3,36.5-29.2,69-36.5l-3.5-7.1c-41.3,3.9-72.7,29.1-72.7,29.1  s-37.2,54-43.6,160c37.5,43.3,94.5,43.6,94.5,43.6l11.9-15.9c-20.2-7-43.1-19.6-62.8-42.3c23.5,17.8,59.1,36.4,116.4,36.4  s92.8-18.5,116.4-36.4c-19.7,22.7-42.6,35.3-62.8,42.3l11.9,15.9c0,0,57-0.3,94.5-43.6C409.6,222.7,372.4,168.7,372.4,168.7z   M208.7,299.6c-14.1,0-25.5-13-25.5-29.1s11.4-29.1,25.5-29.1c14.1,0,25.5,13,25.5,29.1S222.8,299.6,208.7,299.6z M303.3,299.6  c-14.1,0-25.5-13-25.5-29.1s11.4-29.1,25.5-29.1s25.5,13,25.5,29.1S317.3,299.6,303.3,299.6z"
        fill={theme.global.colors.background}
      />
    </svg>
  );
}

export function LatencyIcon(props: IIconProps) {
  const theme = React.useContext(ThemeContext);
  const { size = "24px", color = theme.global.palette.Grey } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512;"
      fill={theme.global.colors[color] || color}
    >
      <g>
        <path
          d="M256,512C114.5,512,0,397.5,0,256c0-69.8,27.9-135.9,78.2-184.3c8.4-8.4,21.4-7.4,28.9,0.9
		c8.4,8.4,7.4,21.4-0.9,28.9C63.3,142.4,40,197.4,40,256c0,118.2,96.8,215,215,215s216-96.8,216-215c0-111.7-85.6-203.9-194.6-214.1
		v80.1c0,11.2-9.3,20.5-20.5,20.5c-11.2,0-20.5-9.3-20.5-20.5V20.5C235.5,9.3,244.8,0,256,0c141.5,0,256,114.5,256,256
		S397.5,512,256,512z"
        />
        <path
          d="M153.6,135.9l127.5,91.2c17.7,12.1,21.4,36.3,9.3,54s-36.3,21.4-54,9.3c-3.7-2.8-6.5-5.6-9.3-9.3
		l-91.2-127.5c-3.7-5.6-2.8-14,2.8-17.7C143.4,132.2,148.9,132.2,153.6,135.9z"
        />
      </g>
    </svg>
  );
}

// export function TransactionsIcon(props: IIconProps) {
//   const theme = React.useContext(ThemeContext);
//   const { size = "24px", color = theme.global.palette.Grey } = props;
//
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="-16 0 480 480"
//       fill={theme.global.colors[color] || color}
//
//     >
//       <path d="m440 224h-72v-184c-.027344-22.082031-17.917969-39.9726562-40-40h-264c-17.671875 0-32 14.328125-32 32v96h-24c-4.417969 0-8 3.582031-8 8v48c0 4.417969 3.582031 8 8 8h24v88c0 4.417969 3.582031 8 8 8h40v160c0 17.671875 14.328125 32 32 32h264c17.671875 0 32-14.328125 32-32s-14.328125-32-32-32h-8v-128h72c4.417969 0 8-3.582031 8-8v-48c0-4.417969-3.582031-8-8-8zm-392-192c0-8.835938 7.164062-16 16-16s16 7.164062 16 16v96h-32zm-32 112h224c4.023438 0 7.421875-2.984375 7.9375-6.976562l27.566406 22.976562-27.566406 22.976562c-.515625-3.992187-3.914062-6.976562-7.9375-6.976562h-224zm32 128v-80h32v80zm344 176c0 8.835938-7.164062 16-16 16h-236.296875c2.824219-4.859375 4.304687-10.378906 4.296875-16v-16h232c8.835938 0 16 7.164062 16 16zm-40-32h-216c-4.417969 0-8 3.582031-8 8v24c0 8.835938-7.164062 16-16 16s-16-7.164062-16-16v-256h136v8c0 3.105469 1.796875 5.933594 4.609375 7.25s6.132813.886719 8.519531-1.105469l48-40c1.820313-1.519531 2.875-3.769531 2.875-6.144531s-1.054687-4.625-2.875-6.144531l-48-40c-2.386718-1.992188-5.707031-2.421875-8.519531-1.105469s-4.609375 4.144531-4.609375 7.25v8h-136v-96c-.027344-5.632812-1.558594-11.15625-4.433594-16h236.433594c13.253906 0 24 10.746094 24 24v184h-136v-8c0-3.105469-1.796875-5.933594-4.609375-7.25s-6.132813-.886719-8.519531 1.105469l-48 40c-1.820313 1.519531-2.875 3.769531-2.875 6.144531s1.054687 4.625 2.875 6.144531l48 40c2.386718 1.992188 5.707031 2.421875 8.519531 1.105469s4.609375-4.144531 4.609375-7.25v-8h136zm80-144h-224c-1.03125.003906-2.050781.210938-3 .609375-.292969.152344-.574219.324219-.847656.511719-.574219.296875-1.113282.660156-1.601563 1.085937-.257812.289063-.496093.59375-.710937.914063-.390625.449218-.722656.941406-1 1.472656-.15625.375-.277344.765625-.367188 1.167969-.167968.390625-.300781.796875-.394531 1.214843l-27.582031-22.976562 27.566406-22.976562c.09375.417968.226562.824218.394531 1.214843.085938.402344.210938.792969.367188 1.167969.273437.53125.609375 1.023438 1 1.472656.214843.320313.453125.625.710937.914063.488282.425781 1.027344.789062 1.601563 1.085937.273437.1875.554687.359375.847656.511719.953125.402344 1.980469.609375 3.015625.609375h224zm0 0" />
//       <path d="m128 48h80v16h-80zm0 0" />
//       <path d="m128 80h80v16h-80zm0 0" />
//       <path d="m160 352h160v16h-160zm0 0" />
//       <path d="m160 384h160v16h-160zm0 0" />
//       <path d="m272 320h48v16h-48zm0 0" />
//     </svg>
//   );
// }

export function GearIcon(props: IIconProps) {
  const theme = React.useContext(ThemeContext);
  const { size = "24px", color = theme.global.palette.Grey } = props;

  return (
    <svg  width={size}
          height={size}
          version="1.1"
          viewBox="0 0 512 512"
          fill={theme.global.colors[color] || color}
    >
      <path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1  c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1  c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6  c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9  c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2  c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4  c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2  c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80  c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z"/>
    </svg>
  );
}

export function SubstackIcon(props: IIconProps) {
  const theme = React.useContext(ThemeContext);
  const { size = "24px", color = theme.global.palette.Grey } = props;

  return (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={theme.global.colors[color] || color}
    >
      <title>Substack</title>
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
    </svg>
  );
}
