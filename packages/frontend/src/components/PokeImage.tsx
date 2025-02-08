import { FC, memo, useContext } from "react";
import { Link } from "react-router-dom";
import { EnemyDexNumberContext, MyDexNumberContext } from "./providers/DexNumberProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";

export const PokeImage:FC<{mode:MyOrEnemey,name:string}> = memo(({mode,name}) => {
    const {dex_number}=useContext((mode==="my" ? MyDexNumberContext:EnemyDexNumberContext));
    return (
        <SRelative>
            <SH1 mode={mode}>{mode==="my" ? "攻撃":"防御"}ポケモン</SH1>
            <Link to={`/poke-dex/?id=${dex_number}`}>
                <SImg src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex_number}.png`} alt={name} />
            </Link>
        </SRelative>
    );
});

const SRelative = styled.div`
    position:relative;
    z-index:0;
`

const SH1= styled.h1<{mode:MyOrEnemey}>`
    font-size:20px;
    margin: 50px 0 0 0;
    padding:4px 0 0 2px;
    @media (max-width: 768px){
        font-size:15px;
        background:
        ${({mode})=>(
            mode=="my" ? 
                "linear-gradient( \
                    to top,\
                    rgba(255,50,20,0.3) 0%,\
                    rgba(255,50,20,0.8) 50%,\
                    rgba(255,50,20,0.2) 100% \
                )"
                :
                "linear-gradient( \
                    to top,\
                    rgba(60,140,255,0.4) 0%,\
                    rgba(60,140,255,0.8) 50%,\
                    rgba(60,140,255,0.2) 100% \
                )"
        )}
    }
`

const SImg = styled.img`
    @media(max-width:768px){
        position:absolute;
        top:-20px;
        left:50%;
        transform: translateX(-50%);
        z-index:-1;
    }
`