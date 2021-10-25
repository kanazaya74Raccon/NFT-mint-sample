import React, { Component } from 'react'
import Menu from './Menu'
import Header from './Header'
import About from './About'
import Loadmap from './LoadMap'
import Footer from './Footer'
import BlockChain from './blockchain/BlockChain'

import { Element } from 'react-scroll'

export default class Main extends Component {
    render() {
        return (
            <div>
                {
                    // This component is used for test
                    // It will be removed in future.
                }
                <BlockChain />
                {
                    ////////////////////////////////////
                }
                <Menu/>
                <Header />
                <Element name="element-about">
                    <About />
                </Element>
                <Element name="element-roadmap">
                    <Loadmap />
                </Element>
                <Footer />
            </div>
        )
    }
}
