/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';
import { Transformer } from 'markmap-lib';
import { Markmap, loadCSS, loadJS } from 'markmap-view';

// console.log(document.querySelector("#markmap"));

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
});

class App {

    /**
     * @Type string
     */
    initialMD;

    /**
     * @Type Transformer
     */
    transformer;

    constructor() {

        this.initMD();
        let md = this.md.value;

        const { root, features } = this.transformer.transform(md);
        const { styles, scripts } = this.transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

        const svgEl = document.querySelector('#svg');
        this.mm = Markmap.create(svgEl, undefined, root);

        document.querySelector('#editor').addEventListener("keyup", (e) => {
            console.log("keyup")
            this.update();
        });

    }

    initMD() {
        this.transformer = new Transformer();
        this.md = document.querySelector("#editor");
    }

    update() {
        let md = this.md.value;

        const { root, features } = this.transformer.transform(md);
        const { styles, scripts } = this.transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

        this.mm.setData(root);
        // this.mm.fit();

    }

}
