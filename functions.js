const widthMap = 6; // data also in .css
const heightMap = 6; // data also in .css
const frequencyDisplay = 4000;
const nbBackgroundTiles = 4;

const $toolsList = document.getElementById('toolsList');
const $informationsSection = document.getElementById('informationsSection');
const $map = document.getElementById('map');
const $informationsCityBar = document.getElementById('informationsCity');

const logos = {
    people: {image: 'images/logo_people.svg', alt: 'people', title: 'People'},
    food: {image: 'images/logo_food.svg', alt: 'food', title: 'Food'},
    log: {image: 'images/logo_log.svg', alt: 'log', title: 'Log'},
    stone: {image: 'images/logo_stone.svg', alt: 'stone', title: 'Stone'},
    happiness: {image: 'images/logo_happiness.png', alt: 'happiness', title: 'Happiness'}
}

// -----------------------------------------------------------------------------
// -------------------------------- Game datas ---------------------------------
// -----------------------------------------------------------------------------

class Building {
    constructor(id, name, description, image, people, production, use, construction, storage) {
        this.id = id;
        this.type = 'building',
        this.name = name;
        this.descr = description;
        this.image = 'images/' + image;
        this.people = people;
        this.production = production;
        this.use = use;
        this.construction = construction;
        this.storage = storage;
    }
}

class Tools {
    constructor(id, name, description, image) {
        this.id = id;
        this.type = 'tool';
        this.name = name;
        this.descr = description;
        this.image = 'images/' + image;
    }
}

// ----- Buildings -----
const farmer = new Building('farmer', 'Farmer', 'Products food', 'building_farmer.svg', 4, 
    {food: 5, log: 0, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 8, log: 0, stone: 0, happiness: 8} // storage
);

const hunter = new Building('hunter', 'Hunter', 'Products food', 'building_hunter.svg', 4, 
    {food: 3, log: 0, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 8, log: 0, stone: 0, happiness: 8} // storage
);

const woodcutter = new Building('woodcutter', 'Woodcutter', 'Products logs', 'building_woodcutter.svg', 4, 
    {food: 0, log: 3, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 4, log: 6, stone: 0, happiness: 8} // storage
);

const stonecutter = new Building('stonecutter', 'Stonecutter', 'Products stones', 'building_stonecutter.svg', 4, 
    {food: 0, log: 0, stone: 3, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 4, log: 0, stone: 6, happiness: 8} // storage
);

const warehouse = new Building('warehouse', 'Warehouse', 'Storage local', 'building_warehouse.svg', 0, 
    {food: 0, log: 0, stone: 0, happiness: 0}, // prod
    {food: 0, log: 0, stone: 0, happiness: 0}, // use
    {food: 0, log: 2, stone: 2, happiness: 0}, // constr
    {food: 20, log: 20, stone: 20, happiness: 8} // storage
);

const circus = new Building('circus', 'Circus', 'Products happiness', 'building_circus.svg', 2,
    {food: 0, log: 0, stone: 0, happiness: 10}, // prod
    {food: 1, log: 0, stone: 0, happiness: 0}, // use
    {food: 0, log: 10, stone: 0, happiness: 0}, // constr
    {food: 0, log: 0, stone: 0, happiness: 0} // storage
);

const townHall = new Building('townHall', 'TownHall', 'Displays city datas', 'building_townhall.svg', 0,
    {food: 0, log: 0, stone: 0, happiness: 0}, // prod
    {food: 0, log: 0, stone: 0, happiness: 0}, // use
    {food: 0, log: 10, stone: 10, happiness: 0}, // constr
    {food: 0, log: 0, stone: 0, happiness: 0} // storage
);

// ----- Tools -----
const broomRemove = new Tools('removeTool', 'Remove', 'Remove clicked building', 'tool_broom.svg');

// ----- General -----
const buildingsArray = [farmer, hunter, woodcutter, stonecutter, warehouse, townHall, circus];
const toolsArray = [broomRemove];
var constructedBuildingsArray = Array(widthMap * heightMap).fill(null);

var dataCity = {people: 0, food: 2, log: 10, stone: 10, happiness: 0};

// -----------------------------------------------------------------------------
// ---------------------------------  Display ----------------------------------
// -----------------------------------------------------------------------------

function displayToolsList() {
    // ----- tools -----
    $toolsList.innerHTML += toolsArray
        .map( tool => `<div id ="${tool.id}" class="selectableTool ${tool.type}">
            <img src="${tool.image}" alt="${tool.name}" title="${tool.name}">
            </div>`)
            .join('');

    // ----- buildings -----
    $toolsList.innerHTML += buildingsArray
        .map( building => `<div id ="${building.id}" class="selectableTool ${building.type}">
            <img src="${building.image}" alt="${building.name}" title="${building.name}">
            </div>`)
            .join('');
}

function displayMap() {
    // random backgrounds
    $map.innerHTML = Array(widthMap * heightMap).fill(1)
        .map((n, i) => `<div id="tile_${i}" class="tileMap tileBackground_${Math.trunc((Math.random()*100) % nbBackgroundTiles)}"></div>`)
        .join('');
}

function displayInformationsCity(cityDatas) {
    let data = cityDatas;
    Object.keys(data).forEach( key => data[key] = Math.trunc(data[key]) );

    let prod = calculateResourcesProd();
    Object.keys(prod).forEach( key => prod[key] = Math.trunc(prod[key]) );

    let used = calculateResourcesUse();
    Object.keys(used).forEach( key => used[key] = -Math.trunc(used[key]) );

    let sum = {};
    Object.keys(prod).forEach( key  => sum[key] = prod[key] + used[key] );

    $informationsCityBar.innerHTML = `<p id="totalPeople"><img src="${logos.people.image}" alt="${logos.people.alt}" title="${logos.people.title}"> ${data.people}</p>`;
    Object.keys(prod).forEach( key => {
        $informationsCityBar.innerHTML += `<div class="catInfosCityBar">
            <p><img src="${logos[key].image}" alt="${logos[key].alt}" title="${logos[key].title}"> ${data[key]} (${displaySignedNumber(sum[key])})</p>
            <div class="details"><p>${displaySignedNumber(prod[key])}</p><p>${displaySignedNumber(used[key])}</p></div>
            </div>`;
        }
    );
}

function displayInitialInformationsCity(){
    displayInformationsCity(dataCity);
}

function displayInformationsTool(idReadTool) {
    var chosenObject = toolsArray.find( tool => (tool.id == idReadTool));
    if(!chosenObject)
        var chosenObject = buildingsArray.find( building => (building.id == idReadTool));
    if (!chosenObject)
        return;

    if (chosenObject.type === 'tool') {
        $informationsSection.innerHTML = `<p class="infosToolTitle">${chosenObject.name}</p>
        <p class="infosToolText">${chosenObject.descr}</p>`;
    }
    else if (chosenObject.type === 'building'){
        addContentInformationsSection(chosenObject);
    }
}

function addContentInformationsSection(chosenObject) {
    $informationsSection.innerHTML = 
        `<p class="infosToolTitle">${chosenObject.name}</p>

        <p class="infosToolText">${chosenObject.descr}<br />
        People : ${chosenObject.people}<img src="${logos.people.image}" alt="${logos.people.alt}" title="${logos.people.title}"></p>

        <p class="infosToolSubTitle">Building construction needs :</p>
        ${renderLogoResourcesCost(logos, chosenObject.construction)}

        <p class="infosToolSubTitle">Building products :</p>
        ${renderLogoResourcesProduction(logos, chosenObject.production)}
        
        <p class="infosToolSubTitle">Building uses :</p>
        ${renderLogoResourcesCost(logos, chosenObject.use)}`;
}

function renderLogoResource(resource) {
    return `<img src="${resource.image}" alt="${resource.alt}" title="${resource.title}">`;
}

function renderLogoResourcesCost(logos, cost) {
    return `<p class="infosToolText">${Object.keys(cost).map(
        key => `${renderLogoResource(logos[key])}-${cost[key]}` 
    ).join('')}</p>
    `; 
}

function renderLogoResourcesProduction(logos, prod) {
    return `<p class="infosToolText">${Object.keys(prod).map(
        key => `${renderLogoResource(logos[key])}+${prod[key]}` 
    ).join('')}</p>
    `; 
}

function displayInformationsTile(idTile) {
    // building on the tile ?
    let selectedBuilding = constructedBuildingsArray[idTile];
    if(!selectedBuilding) return;

    // what building ?
    let displayedBuilding = buildingsArray.find( building => (building.id == selectedBuilding.id));
    if(!displayedBuilding) return;

    // display informations
    addContentInformationsSection(displayedBuilding);
    if(displayedBuilding.id === 'townHall') displayTownhallPopup();
}

function deleteInformationsTool() {
    $informationsSection.innerHTML = '';
}

function displayTownhallPopup(){
    $townhallPopup.classList.remove('hidden');

    $townhallPopup.querySelector('.content').innerHTML = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sem erat, sagittis at accumsan ut, ultricies in nunc. Duis egestas dui in bibendum rutrum. Maecenas ullamcorper metus aliquam nulla ullamcorper</p>`;
}

let lastTime = 0;
function updateDisplayPerFrequency(time){
    const delta = (time - lastTime) / frequencyDisplay;

    dataCity = upDateDatas(dataCity, delta);
    displayInformationsCity(dataCity);

    lastTime = time;
    setTimeout( () => 
        requestAnimationFrame((time) => updateDisplayPerFrequency(time))
    , frequencyDisplay);
}

function displaySignedNumber(n) {
    return n>0 ? '+' + n : n;
}

// -----------------------------------------------------------------------------
// --------------------------------- Buildings ---------------------------------
// -----------------------------------------------------------------------------

function constructBuilding(tile, idChosenTile, idChosenTool){
    let chosenBuilding = buildingsArray.find( building => (building.id == idChosenTool));
    if (!chosenBuilding) return;

    // ----- empty tile ? -----
    if(constructedBuildingsArray[idChosenTile] != null) {
        alert('This case is not empty. Remove actual building.');
        return;
    }
    
    // ----- unique Townhall ? -----
    if (idChosenTool === townHall.id && constructedBuildingsArray.find( building => building && (building.id == townHall.id))){
        alert(`The ${townHall.name} is already built.`);
        return;
    }

    // ----- available resources ? -----
    let possibleConstruction = true;
    Object.keys(chosenBuilding.construction).forEach ( key => {
        if(chosenBuilding.construction[key] > 0 && chosenBuilding.construction[key] > dataCity[key]) {
            alert('More resources are needed...');
            possibleConstruction = false;
        }}
    );

    // construction
    if(possibleConstruction) {
        constructedBuildingsArray[idChosenTile] = chosenBuilding;
        tile.innerHTML = `<img class="buildingOnTileMap" src="${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;
        
        // update datas
        Object.keys(chosenBuilding.construction).forEach( key =>
            dataCity[key] -= chosenBuilding.construction[key]
        );
        dataCity.people += chosenBuilding.people;

        displayInformationsCity(dataCity);
    }
}

function removeBuilding(tile, idChosenTile){
    if(tile.innerHTML != "" && window.confirm('Remove this building?')) {
        tile.innerHTML = '';
        dataCity.people -= constructedBuildingsArray[idChosenTile].people;
        constructedBuildingsArray[idChosenTile] = null;
    }
}


// -----------------------------------------------------------------------------
// -------------------------------  Calculation --------------------------------
// -----------------------------------------------------------------------------

function calculateResourcesProd() {
    let resourcesProd = {food: 0, log: 0, stone: 0, happiness: 0};

    resourcesProd = constructedBuildingsArray
                    .filter(building => building != null)
                    .reduce((prod, building) => {
                        Object.keys(resourcesProd).forEach(key => prod[key] += building.production[key]);
                        return prod;
                    }, resourcesProd);
    
    return resourcesProd;
}

function calculateResourcesUse() {
    let resourcesUsed = {food: 0, log: 0, stone: 0, happiness: 0};

    resourcesUsed = constructedBuildingsArray
                    .filter(building => building != null)
                    .reduce((used, building) => {
                        Object.keys(resourcesUsed).forEach(key => used[key] += building.use[key]);
                        return used;
                    }, resourcesUsed);
    
    return resourcesUsed;
}

function upDateDatas(datas, delta){
    if(Object.keys(datas).length === 0)
        datas = dataCity;

    let resourcesProd = calculateResourcesProd();
    let resourcesUsed = calculateResourcesUse();

    Object.keys(resourcesProd).forEach( key => {
        datas[key] += delta * (resourcesProd[key] - resourcesUsed[key])
    });
    return datas;
}