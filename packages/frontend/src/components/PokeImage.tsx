import { FC, memo, useContext } from "react";
import { Link } from "react-router-dom";
import { EnemyDexNumberContext, MyDexNumberContext } from "./providers/DexNumberProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";

export const PokeImage:FC<{mode:MyOrEnemey,name:string}> = memo(({mode,name}) => {
    const {dex_number}=useContext((mode==="my" ? MyDexNumberContext:EnemyDexNumberContext));
    return (
        <>
            <SRelative>{mode==="my" ? "攻撃":"防御"}ポケモン
                <Link to={`/poke-dex/?id=${dex_number}`}>
                    <SImg src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex_number}.png`} alt={name} />
                </Link>
            </SRelative>
        </>
    );
});

const SRelative = styled.h3`
    position:relative;
`

const SImg = styled.img`
    position:absolute;
    top:-100%;
    left:100%;
    margin-left:8px;
`