import * as React from "react";
import { Component } from 'react';

import styles from "./HomeComponent.scss";

import { Dictionary } from "typescript-collections";


export default class HomeComponent extends React.Component<{}, { counter: 0 }> {
    constructor(props) {
        super(props);
        const dic = new Dictionary<number, string>()
    }

    increment() {

    }

    decriment() {

    }

    render() {
        return (
            <div className={styles.container}>
                <h1>Home page</h1>
                <p className="lead">Nullam mattis convallis nisi, id porttitor nibh tempus sit amet. Quisque congue magna sed tortor luctus finibus. Etiam sed molestie augue. Cras quam enim, faucibus vel sem vitae, vestibulum dignissim dui. Vivamus sapien nibh, bibendum nec lacus nec, fringilla bibendum metus. Duis laoreet interdum leo in vehicula. Fusce sem felis, convallis eu suscipit vel, tristique non eros. Aliquam dolor odio, viverra vel aliquet in, maximus ut nibh. Phasellus venenatis efficitur laoreet. Donec ac lorem nisi. Phasellus lectus mi, congue non erat quis, pellentesque sagittis risus. Etiam id nulla ultricies, aliquet ligula vitae, volutpat nibh. Aliquam ac ullamcorper nisl, et laoreet lectus.</p>
                <p><a className="btn btn-lg btn-success" href="#" role="button">Sign up today</a></p>
                {/* <button onClick={this.increment} >Increment</button> */}
                {/* <button onClick={this.decriment} >Decriment</button> */}
                {/* {this.state.counter} */}
            </div>
        );
    }
}

