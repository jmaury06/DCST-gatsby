const React = require("react")

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <script key={1} src="/static/global.js?v=0.47" defer></script>
  ])
}
