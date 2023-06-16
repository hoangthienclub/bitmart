import * as React from "react";

function Profile(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
            <circle cx={12} cy={8} fill="currentColor" r={4} />
            <path
                d="M20 19v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1a6 6 0 016-6h4a6 6 0 016 6z"
                fill="currentColor"
            />
        </svg>
    );
}

export default Profile;
