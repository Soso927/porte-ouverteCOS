export class Carte {
    #nom
    #image
    #description
    #colortheme

    constructor(nom, image, description, color) {
        this.#nom = nom
        this.#image = image
        this.#description = description
        this.#colortheme = color
        console.log("construct")
    }

    createCard()
    {
        const maCarte = document.createElement("div")
        maCarte.classList.add("carte")
        maCarte.dataset.name = this.#nom
        maCarte.innerHTML = 
        `
        <div class = "carte-face">
            <h3>${this.#nom}</h3>
            <img src="${this.#image}-${this.#colortheme}.png" alt="image de ${this.#nom}">
            <p>${this.#description}</p>
        </div>
        <div class = "carte-verso" style="background-image: url(../flo/public/assets/dos-${this.#colortheme}.png);"> 
        
        </div>
        ` 
        return maCarte
    }

//getter et setter nom
    get nom()
    {
        return this.#nom
    }

    set nom(nom)
    {
        this.#nom = nom
    }

    //getter et setter image
    get image()
    {
        return this.#image
    }

    set image(image)
    {
        this.#image = image
    }

    //getter et setter description
    set description(description)
    {
        this.#description = description
    }

    get description()
    {
        return this.#description
    }


}

