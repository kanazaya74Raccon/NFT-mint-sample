import React, { Component } from 'react'
import headerBgImg from '../asset/img/background1.png'
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'

import NFTMint from './NFTMint';
export default class Header extends Component {
    render() {
        return (
            <div className="pt-36 pb-20 text-center bg-center bg-cover text-white" style={{backgroundImage: `url(${headerBgImg})` }}>
                <div>
                    <div className="text-4xl font-bold mb-28">
                        Welcome Come Take a Hit With Us!
                    </div>
                    <div>
                        <NFTMint />
                    </div>
                    <div className="my-10">
                        <Button className="">
                            <FontAwesomeIcon icon={faDiscord} className="text-3xl text-white"/>
                        </Button>
                        <Button className="">
                            <FontAwesomeIcon icon={faTwitter} className="text-3xl text-white"/>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
