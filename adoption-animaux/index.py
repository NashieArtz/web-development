# Copyright 2024 <WU WUXA90340201>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask, render_template, request, redirect, url_for, g
from .database import Database
from datetime import datetime
import random

app = Flask(__name__)


def get_db():
    """Retourne l’instance de Database attachée au contexte Flask."""
    db = getattr(g, '_database', None)
    if db is None:
        g._database = Database()
    return g._database

@app.teardown_appcontext
def close_connection(exception):
    """Ferme la connexion SQLite à la fin de chaque requête."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.disconnect()

@app.route('/')
def index():
    animaux = get_db().get_animaux()
    selection = random.sample(animaux, k=min(len(animaux), 5))
    return render_template('index.html', animaux=selection)

@app.route('/animal/<int:animal_id>')
def animal_detail(animal_id):
    animal = get_db().get_animal(animal_id)
    if animal is None:
        return "Animal non trouvé", 404
    return render_template('animal.html', animal=animal)

@app.route('/animal/<int:animal_id>/delete', methods=['POST'])
def delete_animal(animal_id):
    db = get_db()
    db.delete_animal(animal_id)
    return redirect(url_for('index'))

@app.route('/search')
def search():
    q = request.args.get('q', '').strip().lower()
    resultats = []
    if q:
        for a in get_db().get_animaux():
            if q in a['nom'].lower():
                resultats.append(a)
    return render_template('index.html', animaux=resultats)

@app.route('/form', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        data = request.form
        new_id = get_db().add_animal(
            data['nom'], data['espece'], data['race'],
            int(data['age']), data['description'],
            data['courriel'], data['adresse'],
            data['ville'], data['cp']
        )
        return redirect(url_for('animal_detail', animal_id=new_id))
    return render_template('form.html')

@app.context_processor
def inject_current_year():
    return {'current_year': datetime.now().year}

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
