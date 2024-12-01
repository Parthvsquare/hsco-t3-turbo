import React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

export const HomeSVG = ({ active }: { active: boolean }) => {
  return (
    <Svg width="20" height="22" viewBox="0 0 20 22" fill="none">
      <G opacity={active ? 1 : 0.5}>
        <Path
          d="M1 8L10 1L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M7 21V11H13V21"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
};

export const ModeSVG = ({ active }: { active: boolean }) => {
  return (
    <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <G opacity={active ? 1 : 0.5}>
        <Rect
          x="1"
          y="1"
          width="7.30769"
          height="7.30769"
          rx="2"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Rect
          x="1"
          y="12.6923"
          width="7.30769"
          height="7.30769"
          rx="2"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Rect
          x="12.6924"
          y="1"
          width="7.30769"
          height="7.30769"
          rx="2"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Rect
          x="12.6924"
          y="12.6923"
          width="7.30769"
          height="7.30769"
          rx="2"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
};

export const ReportSVG = ({
  active,
  color,
}: {
  active: boolean;
  color?: string;
}) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G opacity={active ? 1 : 0.5}>
        <Path
          d="M12 7V17M17 9V15M7 9V15M6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22Z"
          stroke={color ? color : "white"}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
};

export const ProfileSVG = ({ active }: { active: boolean }) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G opacity={active ? 1 : 0.5}>
        <Path
          d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
};

export const LiterSVG = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        d="M8 2.66667H24M10.6667 10.6667H21.3333M10.6667 2.66667H21.3333V24C21.3333 26.9455 18.9455 29.3333 16 29.3333C13.0545 29.3333 10.6667 26.9455 10.6667 24V2.66667Z"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const GradingSVG = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        d="M23.3332 12.6667L15.9998 16L8.6665 12.6667"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M22.83 11.1154L16.83 8.3786C16.3028 8.13812 15.6972 8.13812 15.17 8.3786L9.16999 11.1154C8.4573 11.4405 8 12.1518 8 12.9351V20.3983C8 21.1816 8.4573 21.8928 9.16999 22.2179L15.17 24.9547C15.6972 25.1952 16.3028 25.1952 16.83 24.9547L22.83 22.2179C23.5427 21.8928 24 21.1816 24 20.3983V12.9351C24 12.1518 23.5427 11.4405 22.83 11.1154Z"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16 16V24"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16 2.66667V4"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16 28V29.3333"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M26.7612 5.23857L25.8184 6.18138"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M6.18115 25.8186L5.23834 26.7614"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M29.3335 16L28.0002 16"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M4 16L2.66667 16"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M26.7612 26.7614L25.8184 25.8185"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M6.18115 6.18135L5.23834 5.23855"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const PieceSVG = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        d="M28 24L17.083 28.852C16.3935 29.1584 15.6065 29.1584 14.917 28.852L4 24M28 17.3333L17.083 22.1853C16.3935 22.4918 15.6065 22.4918 14.917 22.1853L4 17.3333M5.05181 10.5259L14.8074 15.4037C15.5582 15.7791 16.4418 15.7791 17.1926 15.4037L26.9482 10.5259C27.9309 10.0345 27.9309 8.63213 26.9482 8.14076L17.1926 3.26295C16.4418 2.88758 15.5582 2.88758 14.8074 3.26295L5.05181 8.14076C4.06908 8.63213 4.06907 10.0345 5.05181 10.5259Z"
        stroke="#28303F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const WeightSVG = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <G clip-path="url(#clip0_35_285)">
        <Path
          d="M12.0688 3.2375H19.9313V7.2125H22.4813V1.9625C22.4813 1.25625 21.9125 0.6875 21.2063 0.6875H10.7938C10.0875 0.6875 9.5188 1.25625 9.5188 1.9625V7.2125H12.0688V3.2375Z"
          fill="black"
        />
        <Path
          d="M22.6375 23.1875C21.8938 23.6125 20.975 23.8312 19.875 23.8312C18.6563 23.8312 17.6875 23.4937 16.9875 22.8187C16.2813 22.1437 15.9313 21.2125 15.9313 20.025C15.9313 18.8312 16.3188 17.8562 17.0875 17.1062C17.8563 16.3562 18.8813 15.9812 20.1563 15.9812C20.9625 15.9812 21.6688 16.0937 22.2875 16.3125V17.9187C21.7 17.5812 20.9875 17.4125 20.1375 17.4125C19.425 17.4125 18.85 17.6437 18.4 18.1062C17.9563 18.5687 17.7313 19.1812 17.7313 19.95C17.7313 20.7312 17.9313 21.3312 18.3313 21.7625C18.7313 22.1875 19.275 22.4062 19.9563 22.4062C20.3625 22.4062 20.6938 22.35 20.9313 22.2312V20.75H19.4125V19.3812H22.6438V23.1875H22.6375ZM13.5188 23.6937L11.3063 20.3937C11.2625 20.3312 11.1938 20.1937 11.1063 19.975H11.0813V23.6937H9.36878V16.1H11.0813V19.6937H11.1063C11.15 19.5937 11.2188 19.4562 11.3188 19.2687L13.4188 16.1H15.4563L12.8063 19.725L15.6813 23.7H13.5188V23.6937ZM31.2938 29.8312L28.0125 9.76245H3.98129L0.706286 29.8312C0.643786 30.1999 0.750036 30.5812 0.993786 30.8624C1.23754 31.1499 1.59379 31.3125 1.96879 31.3125H30.0438C30.4188 31.3125 30.775 31.1499 31.0188 30.8624C31.25 30.5749 31.3563 30.1999 31.2938 29.8312Z"
          fill="black"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_35_285">
          <Rect width="32" height="32" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export const DeviceSVG = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        d="M13.3333 29.3333H18.6667C25.3333 29.3333 28 26.6667 28 20V12C28 5.33333 25.3333 2.66667 18.6667 2.66667H13.3333C6.66667 2.66667 4 5.33333 4 12V20C4 26.6667 6.66667 29.3333 13.3333 29.3333Z"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M23 11.0533C19.0133 7.50667 12.9867 7.50667 9 11.0533L11.9067 15.72C14.24 13.64 17.76 13.64 20.0933 15.72L23 11.0533Z"
        fill="#D9D9D9"
        stroke="#292D32"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const AlarmSVG = () => {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.3332 16.0007C28.3332 22.8127 22.8118 28.334 15.9998 28.334C9.18784 28.334 3.6665 22.8127 3.6665 16.0007C3.6665 9.18866 9.18784 3.66733 15.9998 3.66733C22.8118 3.66733 28.3332 9.18866 28.3332 16.0007Z"
        stroke="#130F26"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M20.5755 19.9239L15.5488 16.9252V10.4625"
        stroke="#130F26"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const EditSVG = () => {
  return (
    <Svg width="37" height="37" viewBox="0 0 37 37" fill="none">
      <Rect
        x="1"
        y="1"
        width="35"
        height="35"
        rx="17.5"
        fill="#F2994A"
        stroke="white"
        stroke-width="2"
      />
      <G clip-path="url(#clip0_123_1274)">
        <Path
          d="M18.3335 12.6667H15.5335C14.4134 12.6667 13.8533 12.6667 13.4255 12.8847C13.0492 13.0764 12.7432 13.3824 12.5515 13.7587C12.3335 14.1865 12.3335 14.7466 12.3335 15.8667V21.4667C12.3335 22.5868 12.3335 23.1468 12.5515 23.5746C12.7432 23.951 13.0492 24.2569 13.4255 24.4487C13.8533 24.6667 14.4134 24.6667 15.5335 24.6667H21.1335C22.2536 24.6667 22.8137 24.6667 23.2415 24.4487C23.6178 24.2569 23.9238 23.951 24.1155 23.5746C24.3335 23.1468 24.3335 22.5868 24.3335 21.4667V18.6667M16.3335 20.6667H17.4498C17.776 20.6667 17.939 20.6667 18.0925 20.6298C18.2285 20.5972 18.3586 20.5433 18.4779 20.4702C18.6124 20.3877 18.7277 20.2724 18.9583 20.0418L25.3335 13.6667C25.8858 13.1144 25.8858 12.219 25.3335 11.6667C24.7812 11.1144 23.8858 11.1144 23.3335 11.6667L16.9583 18.0418C16.7277 18.2724 16.6124 18.3877 16.53 18.5223C16.4569 18.6416 16.403 18.7716 16.3703 18.9077C16.3335 19.0611 16.3335 19.2242 16.3335 19.5503V20.6667Z"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_123_1274">
          <Rect
            width="16"
            height="16"
            fill="white"
            transform="translate(11 10)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export const SettingSVG = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G id="Iconly/Light/Setting">
        <G id="Setting">
          <Path
            id="Path_33946"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.8064 7.62357L20.184 6.54348C19.6574 5.62956 18.4905 5.31427 17.5753 5.83867V5.83867C17.1397 6.0953 16.6198 6.16811 16.1305 6.04104C15.6411 5.91398 15.2224 5.59747 14.9666 5.16133C14.8021 4.8841 14.7137 4.56835 14.7103 4.24599V4.24599C14.7251 3.72918 14.5302 3.22836 14.1698 2.85762C13.8094 2.48689 13.3143 2.27782 12.7973 2.27803H11.5433C11.0367 2.27802 10.5511 2.47987 10.1938 2.8389C9.83644 3.19793 9.63693 3.68455 9.63937 4.19107V4.19107C9.62435 5.23688 8.77224 6.07677 7.72632 6.07666C7.40397 6.07331 7.08821 5.9849 6.81099 5.82036V5.82036C5.89582 5.29597 4.72887 5.61125 4.20229 6.52517L3.5341 7.62357C3.00817 8.53635 3.31916 9.70256 4.22975 10.2323V10.2323C4.82166 10.574 5.18629 11.2055 5.18629 11.889C5.18629 12.5725 4.82166 13.204 4.22975 13.5458V13.5458C3.32031 14.0719 3.00898 15.2353 3.5341 16.1453V16.1453L4.16568 17.2346C4.4124 17.6797 4.82636 18.0082 5.31595 18.1474C5.80554 18.2865 6.3304 18.2249 6.77438 17.976V17.976C7.21084 17.7213 7.73094 17.6515 8.2191 17.7822C8.70725 17.9128 9.12299 18.233 9.37392 18.6716C9.53845 18.9488 9.62686 19.2646 9.63021 19.587V19.587C9.63021 20.6435 10.4867 21.5 11.5433 21.5H12.7973C13.8502 21.5 14.7053 20.6491 14.7103 19.5961V19.5961C14.7079 19.088 14.9086 18.6 15.2679 18.2407C15.6272 17.8814 16.1152 17.6806 16.6233 17.6831C16.9449 17.6917 17.2594 17.7797 17.5387 17.9394V17.9394C18.4515 18.4653 19.6177 18.1543 20.1474 17.2437V17.2437L20.8064 16.1453C21.0615 15.7075 21.1315 15.186 21.001 14.6963C20.8704 14.2067 20.55 13.7893 20.1108 13.5366V13.5366C19.6715 13.2839 19.3511 12.8665 19.2206 12.3769C19.09 11.8873 19.16 11.3658 19.4151 10.9279C19.581 10.6383 19.8211 10.3982 20.1108 10.2323V10.2323C21.0159 9.70285 21.3262 8.54345 20.8064 7.63272V7.63272V7.62357Z"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Circle
            id="Ellipse_737"
            cx="12.1747"
            cy="11.889"
            r="2.63616"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </G>
      </G>
    </Svg>
  );
};

export const ArcSVG = () => {
  return (
    <Svg width="251" height="181" viewBox="0 0 251 181" fill="none">
      <Path
        d="M234.389 180.02C236.228 180.941 238.471 180.199 239.337 178.333C247.802 160.094 251.769 140.069 250.877 119.945C249.93 98.5792 243.539 77.8097 232.31 59.6078C221.082 41.4059 205.387 26.3756 186.717 15.9433C168.048 5.51104 147.021 0.0230044 125.635 7.21461e-05C104.248 -0.0228601 83.2098 5.42007 64.5176 15.8123C45.8254 26.2045 30.099 41.2011 18.8311 59.3789C7.56322 77.5567 1.12764 98.3124 0.135197 119.676C-0.799582 139.799 3.12381 159.832 11.5498 178.089C12.4117 179.957 14.6531 180.704 16.4944 179.787V179.787C18.3357 178.87 19.0793 176.636 18.2208 174.767C10.3587 157.647 6.70027 138.876 7.57614 120.022C8.50968 99.9261 14.5633 80.4023 25.1624 63.3035C35.7615 46.2046 50.5544 32.0981 68.1372 22.3227C85.7199 12.5473 105.509 7.42746 125.627 7.44903C145.744 7.47061 165.522 12.6329 183.084 22.446C200.646 32.259 215.408 46.3973 225.971 63.5188C236.533 80.6403 242.545 100.177 243.435 120.275C244.271 139.131 240.572 157.894 232.673 174.997C231.811 176.864 232.55 179.1 234.389 180.02V180.02Z"
        fill="url(#paint0_linear_123_728)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_123_728"
          x1="1.91649e-06"
          y1="104.24"
          x2="259.915"
          y2="112.47"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stop-color="#817EA8" />
          <Stop offset="1" stop-color="#FCA311" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export const PowerSVG = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.3601 6.64001C19.6185 7.8988 20.4754 9.50246 20.8224 11.2482C21.1694 12.994 20.991 14.8034 20.3098 16.4478C19.6285 18.0921 18.4749 19.4976 16.9949 20.4864C15.515 21.4752 13.775 22.0029 11.9951 22.0029C10.2152 22.0029 8.47527 21.4752 6.99529 20.4864C5.51532 19.4976 4.36176 18.0921 3.68049 16.4478C2.99921 14.8034 2.82081 12.994 3.16784 11.2482C3.51487 9.50246 4.37174 7.8988 5.63012 6.64001"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12 2V12"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export const SaveSVG = () => {
  return (
    <Svg width="24" height="25" viewBox="0 0 24 25" fill="none">
      <Path
        d="M19 21.6046H5C4.46957 21.6046 3.96086 21.3938 3.58579 21.0188C3.21071 20.6437 3 20.135 3 19.6046V5.60455C3 5.07412 3.21071 4.56541 3.58579 4.19034C3.96086 3.81527 4.46957 3.60455 5 3.60455H16L21 8.60455V19.6046C21 20.135 20.7893 20.6437 20.4142 21.0188C20.0391 21.3938 19.5304 21.6046 19 21.6046Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M17 21.6046V13.6046H7V21.6046"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M7 3.60455V8.60455H15"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
