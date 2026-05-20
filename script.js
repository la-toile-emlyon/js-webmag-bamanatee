const apiURL='';
function getData() {
  fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      /// EXAM: COMPLÉTEZ LE CODE ICI !
      console.log(data);
      // TODO 1: REMPLIR LE HEADER
      let nomJournalHTML=document.getElementById("nom-journal");
      let phraseAccrocheHTML=document.getElementById("phrase-accroche");
      let nom=data.journal.nomJournal;
      let phrase=data.journal.phraseAccroche;
      nomJournalHTML.insertAdjacentHTML("beforeend",nom);
      phraseAccrocheHTML.insertAdjacentHTML("beforeend",phrase);
      // TODO 2: REMPLIR LA NAVIGATION
      let themesNav=document.getElementById("themes-nav");
      let themes=data.journal.themes;
      let buttonAll=`<button class="nav-theme-btn active">Tous</button>`;

      // FONCTION POUR CREER LES BOUTONS AUTOMATIQUEMENT
      function creerBoutonTheme(theme){
        let buttonThemes=`<button class="nav-theme-btn">${theme.nom}</button>`
        themesNav.insertAdjacentHTML("beforeend", buttonThemes);
      };
      // AFFICHAGE
      themesNav.insertAdjacentHTML("beforeend", buttonAll);
      let articlesGrid=document.getElementById("articles-grid");
      themes.forEach(element => {
        creerBoutonTheme(element);
      });
      // TODO 3: REMPLIR L'ARTICLE PRINCIPAL
      let articlePrincipalHTML=document.getElementById("article-principal");
      let titre=data.journal.articlePrincipal.titre;
      let date=data.journal.articlePrincipal.date;
      let description=data.journal.articlePrincipal.description;
      let image=data.journal.articlePrincipal.image;
      let badgeTheme=data.journal.articlePrincipal.theme;
      // AFFICHAGE
      let articlePrincipal=`
      <img src="${image}" alt="" id="hero-image">
      <div class="hero-info">
        <span class="theme-badge">${badgeTheme}</span>
        <h1 id="hero-titre">${titre}</h1>
        <p id="hero-description">${description}</p>
        <p class="date">${date}</p>
      </div>
      `
      articlePrincipalHTML.insertAdjacentHTML("beforeend", articlePrincipal);
      
      // TODO 4: REMPLIR LA GRILLE D'ARTICLES
      let articles=data.journal.articles;
      function creerArticle(flan){
        let article=`
        <div class="article-card">
          <img src="${flan.image}" alt="${flan.titre}">
          <div class="article-content">
            <span class="theme-badge">${flan.theme}</span>
            <h3>${flan.titre}</h3>
            <h4>Avis: ${flan.popularite}</h4>
            <p>${flan.date}</p>
          </div>
        </div>
        `;
        articlesGrid.insertAdjacentHTML("beforeend", article);
      }
      articles.forEach(article => {
        creerArticle(article);
      });
      // TODO 5: REMPLIR LES THEMES
      let themesList=document.getElementById("themes-list");
      // THEME DEJA INITIALISE EN HAUT
      function afficherThemes(theme){
        let nom=theme.nom;
        let description=theme.description;
        let articleTheme=`
        <div class="theme-item">
          <h3>${nom}</h3>
          <p>${description}</p>
        </div>
        `
        themesList.insertAdjacentHTML("beforeend", articleTheme);
      }
      // AFFICHAGE
      themes.forEach(theme => {
        afficherThemes(theme);
      });
      // TODO 6: REMPLIR LES AUTEURS
      let swiperWrapper=document.querySelector(".swiper-wrapper");
      let auteurs=data.journal.auteurs;
      function afficherAuteurs(auteur){
        let carteAuteur=`
        <div class="swiper-slide">
          <div class="author-card">
            <img src="${auteur.photo}" alt="Présentation de ${auteur.prenom}, ${auteur.presentation}" class="author-image">
            <h3>${auteur.prenom}</h3>
            <h3 class="author-role">${auteur.typeExperience}</h3>
            <p class="author-bio">${auteur.presentation}</p>
          </div>
        </div>
        `
        swiperWrapper.insertAdjacentHTML("beforeend", carteAuteur);
      }
      auteurs.forEach(nomAuteur => {
        afficherAuteurs(nomAuteur);
      });
      const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
      
      // TODO 7: REMPLIR LE CALL TO ACTION
      let callToAction=document.getElementById("call-to-action");
      let callToActionText=data.journal.texteAppelAction;
      let AppelAAction=`
      <p>${callToActionText}</p>
      <button class="cta-button">S'abonner</button>
      `
      callToAction.insertAdjacentHTML("beforeend", AppelAAction);
      /// FIN DU CODE
      // BONUS 1 : Alert sur le bouton CTA
      let ctaButton=document.querySelector(".cta-button");
      ctaButton.addEventListener("click", function(){
        alert("Vous serez à présent notifié(e) de toutes nos actualités!");
      })
      // BONUS 2 : Filtrage par thème
      let navThemeBtn=document.querySelectorAll(".nav-theme-btn");
      function filterButtons(button){
        button.addEventListener("click", function(){
          let nomTheme = button.textContent;
          articlesGrid.innerHTML=" "
          if (nomTheme==="Tous"){
            articles.forEach(article => {
              creerArticle(article)
            });
          }else{
            let articlesFiltres = articles.filter(button => nomTheme === button.theme);
            articlesFiltres.forEach(article => {
              creerArticle(article)
            });
          }
        })
      };
      navThemeBtn.forEach(button => {
        filterButtons(button);
      });
      // BONUS 3 : Tri par popularité
      // DECLARATION + AFFICHAGE DES BOUTONS
      let buttonFilterDefault=`<button class="read-btn" id="filter-default">Par défaut</button>`;
      let buttonFilterPopularity=`<button class="read-btn" id="filter-popularity">Par popularité</button>`;
      articlesGrid.insertAdjacentHTML("beforebegin", buttonFilterDefault);
      articlesGrid.insertAdjacentHTML("beforebegin", buttonFilterPopularity);
      // FONCTIONS PAR DEFAUT ET PAR POPULARITE
      // TABLEAU RECENSANT LETAT INITIAL DE JOURNAL.ARTICLES
      let articlesOriginaux=articles.slice(); 
      function trierArticlesPopularity(tableauArticles){
        articlesGrid.innerHTML=" "
        let articlesTriesPopularity=tableauArticles.sort((a, b) => b.popularite - a.popularite);
        articlesTriesPopularity.forEach(article => {
          creerArticle(article);
        });  
      }
      function trierArticlesDefault(tableauArticles){
        articlesGrid.innerHTML=" "
        articlesOriginaux.forEach(article => {
          creerArticle(article);
        });  
      }
      let filterPopularity=document.getElementById("filter-popularity");
      let filterDefault=document.getElementById("filter-default");
      let articlesSection=document.querySelector(".articles-section");
      filterDefault.addEventListener("click", function(){
        
        trierArticlesDefault(articles);
      })
      filterPopularity.addEventListener("click", function(){
        trierArticlesPopularity(articles);
      })
    })
    .catch((error) => console.error('Erreur lors de la lecture des données :', error));
}

getData();
function getFoodImage() {
  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      
    })
    .catch((error) => console.error('Erreur lors de la lecture des données :', error));
}

getFoodImage();