/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';
import api from './js/api'
import { Transformer } from 'markmap-lib';
import { Markmap, loadCSS, loadJS } from 'markmap-view';

// console.log(document.querySelector("#markmap"));

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
});

class App {

    /**
     * @Type HTMLTextAreaElement
     */
    md;

    /**
     * @Type Transformer
     */
    transformer;

    /**
     * @Type Markmap
     */
    mm;

    /**
     * @Type HTMLInputElement
     */
    inputTitle;

    /**
     * @type string
     */
    pageId

    /**
     * délai d'update du markdown en bdd
     * @type {number}
     */
    updateDelay = 15000;

    /**
     * @type {boolean}
     */
    toUpdate = false;

    constructor() {

        this.initMD();
        this.pageId = document.querySelector("#pageId").value;
        let md = this.md.value;

        const { root, features } = this.transformer.transform(md);
        const { styles, scripts } = this.transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

        const svgEl = document.querySelector('#svg');
        this.mm = Markmap.create(svgEl, undefined, root);

        window.addEventListener("beforeunload", async () => {
            this.updateData();
        });

        this.inputTitle.addEventListener("keyup", (e) => {
            const value = e.target.value.length === 0 ? 'Sans titre' : e.target.value;
            document.title = value
            this.updateData();
        });

        this.md.addEventListener("keyup", (e) => {
            this.updateMarkmap();
            this.toUpdate = true;
            console.log(this.toUpdate)
        });

        this.checkUpdate();

    }

    /**
     * init des champs nécessaires à markMap
     */
    initMD() {
        this.transformer = new Transformer();
        this.md = document.querySelector("#editor");
        this.inputTitle = document.querySelector('#page-title');
    }

    /**
     * update visuel du svg
     */
    updateMarkmap() {
        let md = this.md.value;

        const { root, features } = this.transformer.transform(md);
        const { styles, scripts } = this.transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

        this.mm.setData(root);
        // this.mm.fit();

    }

    /**
     * update en bdd
     * @returns {Promise<void>}
     */
    async updateData()
    {
        console.log(this.md.value)
        const data = {
            title: this.inputTitle.value,
            content: this.md.value
        };

        await api.patch(`/maps/${this.pageId}`, JSON.stringify(data));
    }

    /**
     * vérifier si on a besoin d'update bdd et la faire si besoin
     */
    checkUpdate()
    {
        setTimeout(()=>{
            if (this.toUpdate)
            {
                this.updateData();
                this.toUpdate = false;
                this.checkUpdate();
            }
        }, this.updateDelay)
    }

}
