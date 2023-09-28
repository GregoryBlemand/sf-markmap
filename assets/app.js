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

    /**
     * @type HTMLButtonElement
     */
    btnAdd;

    /**
     * @type HTMLInputElement
     */
    refit

    constructor() {

        this.init();

        this.anchorPages.forEach(anchorPage => {
            anchorPage.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showContextMenu(e);
            });

            if (anchorPage.classList.contains('active') && anchorPage.dataset.id !== this.pageId)
            {
                window.location.href = `/pages/${anchorPage.dataset.id}`;
            }
        });

        document.querySelector('.btn-delete-page').addEventListener('click', async () => {
            await this.deletePage();
        });

        document.querySelector('body').addEventListener('click', () => {
            this.contextmenu.classList.remove('visible');
        }, true);

        window.addEventListener("beforeunload", async () => {
            this.updateData();
        });

        this.inputTitle.addEventListener("keyup", (e) => {
            const value = e.target.value.length === 0 ? 'Sans titre' : e.target.value;
            this.currentAnchorPage.innerText = value;
            document.title = value
            this.updateData();
        });

        this.md.addEventListener("keyup", (e) => {
            this.updateMarkmap();
            this.toUpdate = true;
        });

        this.btnAdd.addEventListener('click', async (e) => {
            await this.addPage();
        });

        this.checkUpdate();

    }

    /**
     * init des champs nécessaires à markMap
     */
    init() {
        this.transformer = new Transformer();
        this.md = document.querySelector("#editor");
        this.inputTitle = document.querySelector('#page-title');
        this.btnAdd = document.querySelector('#btn-add-page');
        this.refit = document.querySelector('#refit');
        this.contextmenu = document.querySelector('.context-menu');

        this.pageId = document.querySelector("#pageId").value;

        this.anchorPages = Array.from(document.querySelectorAll('.anchor-page'));
        this.currentAnchorPage = this.anchorPages.find(anchorPage => anchorPage.dataset.id == this.pageId);

        let md = this.md.value;

        const { root, features } = this.transformer.transform(md);
        const { styles, scripts } = this.transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

        const svgEl = document.querySelector('#svg');
        this.mm = Markmap.create(svgEl, undefined, root);
    }

    /**
     * update visuel du svg
     */
    updateMarkmap() {
        let md = this.md.value;

        const { root, features } = this.transformer.transform(md);
        const { styles, scripts } = this.transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => this.mm });

        this.mm.setData(root);
        if (this.refit.checked) this.mm.fit();
    }

    /**
     * update en bdd
     * @returns {Promise<void>}
     */
    async updateData()
    {
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

    async addPage() {
        const pageId = (await api.post('maps')).result;

        const li = document.createElement('li');
        const a = document.createElement('a');

        a.classList.add("link-dark", "d-inline-flex", "rounded", "text-decoration-none", "anchor-page");
        a.dataset.id = pageId;
        a.href = `/${pageId}`;
        a.innerText = 'Sans titre';

        li.appendChild(a);
        document.querySelector('.pages-list').appendChild(li);
    }

    async deletePage() {
        const pageId = this.clickedAnchorPage.dataset.id;

        await api.delete(`/maps/${pageId}`);

        if (pageId === this.pageId)
        {
            document.location.reload();
        }

        this.clickedAnchorPage.remove();
    }

    /**
     *
     * @param {MouseEvent} e
     */
    showContextMenu (e) {
        this.contextmenu.style.top = `${e.clientY}px`;
        this.contextmenu.style.left = `${e.clientX}px`;
        this.contextmenu.classList.add('visible');
        this.clickedAnchorPage = e.target;
    }

}
