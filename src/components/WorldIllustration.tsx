import { useId } from "react";

/** Decorative, locally rendered map artwork. Flags are bundled with the app. */
export default function WorldIllustration() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 480 290"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <pattern
          id={`${id}-grid`}
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M26 0H0V26"
            stroke="#748F7A"
            strokeOpacity=".075"
            strokeWidth=".7"
          />
        </pattern>
        <radialGradient id={`${id}-fade`}>
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="480" height="290" fill={`url(#${id}-fade)`} />
        </mask>
        <filter
          id={`${id}-shadow`}
          x="-60%"
          y="-60%"
          width="220%"
          height="240%"
        >
          <feDropShadow
            dx="0"
            dy="7"
            stdDeviation="7"
            floodColor="#244B37"
            floodOpacity=".13"
          />
        </filter>
        <clipPath id={`${id}-japan`}>
          <rect x="-29" y="-21" width="58" height="42" rx="2" />
        </clipPath>
        <clipPath id={`${id}-brazil`}>
          <rect x="-31" y="-23" width="62" height="46" rx="2" />
        </clipPath>
        <clipPath id={`${id}-italy`}>
          <rect x="-26" y="-19" width="52" height="38" rx="2" />
        </clipPath>
      </defs>

      <rect
        width="480"
        height="290"
        fill={`url(#${id}-grid)`}
        mask={`url(#${id}-mask)`}
      />
      <ellipse
        cx="248"
        cy="146"
        rx="196"
        ry="108"
        stroke="#8EA38E"
        strokeOpacity=".16"
        strokeWidth=".8"
      />
      <ellipse
        cx="248"
        cy="146"
        rx="118"
        ry="108"
        stroke="#8EA38E"
        strokeOpacity=".1"
        strokeWidth=".8"
      />
      <path
        d="M53 146H443M75 97H421M75 195H421"
        stroke="#8EA38E"
        strokeOpacity=".1"
        strokeWidth=".8"
      />

      {/* A deliberately simplified, naturalistic world silhouette. */}
      <g fill="#B3C5B0" fillOpacity=".78">
        <path d="m42 91 13-10 14 1 8-9 15-4 10-10 22 2 8 7 20-1 12 7 13-5 11 8-3 8-15 7-5 9-15 1-7 10-10 3-5 13-13 6-3 12 7 10-2 8 8 10-2 8-11-7-9-14-12-4-7-12-13-5-3-14-12-7-1-9-14-5z" />
        <path d="m99 60 7-12 21-9 20 1 10 7-10 5-2 9-16 2-9-3-10 5z" />
        <path d="m157 44 16-6 21 5-1 11-10 9-7 9-12-3-4-11z" />
        <path d="m134 166 10-3 13 7 8 6 13 1 7 10-6 11-3 13-10 8-3 13-8 14-8 9-4-16-5-10-2-14-6-9-2-14-7-8 3-11z" />
        <path d="m222 89 8-7 3-13 8-7 6 3-2 13-7 9-1 10-11 4-6-4z" />
        <path d="m215 105 7-6 13-1 6-8 13 2 9-7 6 9 9 1 4 11-8 10-12-3-7 7-8-2-3 8-10-1-3-11-9-1-2-8-8 3z" />
        <path d="m216 132 11-9 17 1 10 5 17-1 8 12 7 3-5 11-11 11-2 20-10 14-6 16-9 5-6-13-2-15-9-9-3-14-10-4-3-16z" />
        <path d="m278 88 16-14 18-1 5-9 20 4 12-5 11 6 18-3 17 8 14 1 11 11 18 7-1 10-16 5-11-7-14 5-1 11-10 3-2 10-16 4-6 11-12-3-5 13-8 4-7-10-10-8-6 1-8-12-13-2-8-13-13-2-8-12-8-2-5-12z" />
        <path d="m283 128 13 7 9 2 1 10-6 10-10-9-5-11-6-3z" />
        <path d="m317 148 10 5 2 13 10 11 5 14-8 1-8-12-4-12-7-9z" />
        <path d="m348 174 6 6 8 1 4 8 14 3 4 6-12 1-10-5-12-3-6-8z" />
        <path d="m399 135 5-8 3-13 5-4 3 8-6 10-5 9-5 5z" />
        <path d="m372 211 13-7 17-2 9-9 7 11 10 7 3 13-10 7-11-1-10 4-13-6-10 2-8-8z" />
        <path d="m437 239 7-10 4-1-3 11-6 6-4-1zM430 251l7-7 4 2-5 9-7 2z" />
        <path d="m277 197 5-10 4 2-1 13-5 9-4-3z" />
        <path d="m201 99 4-4 4 7-2 7-5-2zM211 90l5-2 1 6-4 3z" />
      </g>

      <path
        d="M120 98C158 53 279 47 374 104"
        stroke="#698B6C"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity=".55"
      />
      <path
        d="M374 104C364 190 263 238 162 204"
        stroke="#698B6C"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity=".55"
      />
      <path
        d="M162 204C102 183 90 149 120 98"
        stroke="#698B6C"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity=".35"
      />

      <g fill="#52785B">
        <circle cx="120" cy="98" r="3" />
        <circle cx="374" cy="104" r="3" />
        <circle cx="162" cy="204" r="3" />
        <circle cx="248" cy="115" r="2.5" />
        <circle cx="325" cy="155" r="2" />
      </g>
      <circle cx="248" cy="115" r="8" stroke="#52785B" strokeOpacity=".22" />
      <circle cx="248" cy="115" r="13" stroke="#52785B" strokeOpacity=".1" />

      <g
        transform="translate(121 79) rotate(-10)"
        filter={`url(#${id}-shadow)`}
      >
        <rect x="-33" y="-26" width="66" height="52" rx="6" fill="#FFFEFA" />
        <image
          href="/flags/it.svg"
          x="-26"
          y="-19"
          width="52"
          height="38"
          preserveAspectRatio="none"
          clipPath={`url(#${id}-italy)`}
        />
      </g>
      <g transform="translate(377 94) rotate(10)" filter={`url(#${id}-shadow)`}>
        <rect x="-37" y="-29" width="74" height="58" rx="7" fill="#FFFEFA" />
        <image
          href="/flags/jp.svg"
          x="-29"
          y="-21"
          width="58"
          height="42"
          preserveAspectRatio="none"
          clipPath={`url(#${id}-japan)`}
        />
        <rect
          x="-29"
          y="-21"
          width="58"
          height="42"
          rx="2"
          stroke="#E8EAE3"
          strokeWidth=".6"
        />
      </g>
      <g
        transform="translate(178 211) rotate(-7)"
        filter={`url(#${id}-shadow)`}
      >
        <rect x="-39" y="-31" width="78" height="62" rx="7" fill="#FFFEFA" />
        <image
          href="/flags/br.svg"
          x="-31"
          y="-23"
          width="62"
          height="46"
          preserveAspectRatio="none"
          clipPath={`url(#${id}-brazil)`}
        />
      </g>

      <g
        transform="translate(419 218)"
        stroke="#69816D"
        strokeWidth=".8"
        opacity=".6"
      >
        <circle r="13" />
        <path d="M0-17V17M-17 0H17" />
        <path d="m0-8 3 8-3-2-3 2z" fill="#69816D" stroke="none" />
      </g>
      <g
        fill="#819780"
        opacity=".65"
        fontFamily="monospace"
        fontSize="6.5"
        letterSpacing="1"
      >
        <text x="67" y="253">
          48° 51′ N
        </text>
        <text x="315" y="48">
          EXPLORE THE WORLD
        </text>
      </g>
      <path
        d="M70 47h8m-4-4v8M440 164h6m-3-3v6M244 255h6m-3-3v6"
        stroke="#7E977F"
        strokeOpacity=".45"
      />
    </svg>
  );
}
