import * as React from "react";

function Reload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" width="16" height="16" {...props}>
      <path
        fill="currentColor"
        d="M64 256H34a222 222 0 01396-137.85V85h30v105H355v-30h67.27A192.21 192.21 0 00256 64C150.13 64 64 150.13 64 256zm384 0c0 105.87-86.13 192-192 192a192.21 192.21 0 01-166.27-96H157v-30H52v105h30v-33.15A222 222 0 00478 256z"
      />
    </svg>
  );
}

export default Reload;
