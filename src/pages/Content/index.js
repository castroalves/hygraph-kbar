import React from 'react';
import { render } from 'react-dom';
import CommandBar from './modules/CommandBar';

const App = () => {
    return <CommandBar />;
};

const root = document.createElement("div");
root.id = "app-container";

render(
    <App />,
    root
);

if (module.hot) module.hot.accept();
