import{cq as f,r as i,a as h,cr as t,cs as e,ct as j,E as S,Q as w}from"./index-CgPThYe5.js";function E(n){const{obstaclePosition:a,obstacleRotation:r,friction:c,restitution:l,speed:u}=f("BlockSpinner",{obstaclePosition:[0,.3,0],obstacleRotation:[0,0,0],friction:.5,restitution:.5,speed:5},{collapsed:!0}),[p]=i.useState(Math.random()-.5),o=i.useRef(null);return h(({clock:d})=>{var s;const m=d.getElapsedTime(),x=new S(0,m*u*p,0),b=new w().setFromEuler(x);(s=o.current)==null||s.setNextKinematicRotation(b)}),t.jsxs("group",{...n,children:[t.jsx(e,{receiveShadow:!0,size:[4,.2,4],position:[0,0,0],type:"floor2"}),t.jsxs(j,{name:"obstacle",ref:o,type:"kinematicPosition",friction:c,restitution:l,position:a,rotation:r,children:[t.jsx(e,{castShadow:!0,size:[3.8,.05,.05],type:"obstacle"}),t.jsx(e,{size:[3.8,.05,.05],position:[0,0,.2],type:"obstacle",castShadow:!0}),t.jsx(e,{castShadow:!0,size:[3.8,.05,.05],position:[0,0,-.2],type:"obstacle"})]})]})}export{E as default};
