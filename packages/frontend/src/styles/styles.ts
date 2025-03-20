import {css} from "styled-components";

export const title = {
    fontSize:'12px',
    fontWeight:'normal', 
    color:'#808080',
    margin:'5px 0 0 0'
}

export const label = css`
    font-size:13px;
    background-color:white;
    padding:0 2px;
    position:absolute;
    top:-5px;
    left:50%;
    transform:translateX(-50%);
    white-space:nowrap
`;

export const white_box = css`
    border:1px solid lightgray;
    background:white;
    box-shadow:2px 2px 5px rgba(0,0,0,0.3);
    border-radius:10px;
    margin:5px 0px;
    padding:10px;
`;