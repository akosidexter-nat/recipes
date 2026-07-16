import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAqCtUIt1g8OTfkiH84_733u31JKz5ejg8",
    authDomain: "recipe-aa47b.firebaseapp.com",
    projectId: "recipe-aa47b",
    storageBucket: "recipe-aa47b.firebasestorage.app",
    messagingSenderId: "641986199023",
    appId: "1:641986199023:web:726798422719ef09e20a1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function toggleForm() {
    const form = document.getElementById('form-container');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

export async function initApp(category) {
    document.getElementById('add-form').addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const ingredients = document.getElementById('ingredients').value.split('\n').filter(l => l.trim());
        const steps = document.getElementById('steps').value.split('\n').filter(l => l.trim());

        const saveBtn = e.target.querySelector('.save-btn');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        await addDoc(collection(db, 'recipes'), { name, description, ingredients, steps, category });

        e.target.reset();
        toggleForm();
        saveBtn.textContent = 'Save';
        saveBtn.disabled = false;
        await loadRecipes(category);
    });

    await loadRecipes(category);
}

async function loadRecipes(category) {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '<p class="empty">Loading...</p>';

    const q = query(collection(db, 'recipes'), where('category', '==', category));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        grid.innerHTML = '<p class="empty">No recipes yet — add one!</p>';
        return;
    }

    grid.innerHTML = '';
    snapshot.forEach(docSnap => {
        const r = docSnap.data();
        grid.innerHTML += `
            <a href="recipe.html?id=${docSnap.id}" class="recipe-card">
                <h2>${r.name}</h2>
                ${r.description ? `<p>${r.description}</p>` : ''}
            </a>
        `;
    });
}

export async function loadRecipe() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { window.location.href = 'index.html'; return; }

    const docSnap = await getDoc(doc(db, 'recipes', id));

    if (!docSnap.exists()) {
        document.getElementById('recipe-name').textContent = 'Recipe not found';
        return;
    }

    const r = docSnap.data();
    document.title = r.name;
    document.getElementById('recipe-name').textContent = r.name;
    document.getElementById('back-link').href = `${r.category}.html`;

    const ingList = document.getElementById('ingredients-list');
    r.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        ingList.appendChild(li);
    });

    const stepsList = document.getElementById('steps-list');
    r.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });
}
