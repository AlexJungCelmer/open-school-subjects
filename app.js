require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// Logic goes here
// importing user context
const Subject = require("./model/subject");

// Register
app.post("/subject/register", auth, async (req, res) => {
	// our register logic goes here...
	try {
		// Get subject input
		const { name } = req.body;

		// Validate subject input
		if (!(name)) {
			res.status(400).send({ message: 'Todos campos devem ser preenchidos!' });
		}

		// check if subject already exist
		// Validate if subject exist in our database
		const oldUser = await Subject.findOne({ name: name.toLowerCase() });

		if (oldUser) {
			return res.status(409).send({ message: 'Matéria já registrado. Por favor faça login.' });
		}

		// Create subject in our database
		const subject = await Subject.create({
			name: name.toLowerCase(),
		});

		// return new subject
		return res.status(201).json(subject);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Erro ao criar matéria.' })
	}
});

app.post("/subject/:id", auth, async (req, res) => {
	const id = req.params.id

	const { name } = req.body;

	try {
		subject = await Subject.findOneAndUpdate({ id }, {
			name: name.toLowerCase(),
		});
		return res.status(204).json(subject)
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Erro ao editar matéria" })
	}


});

app.get("/subjects/", auth, async (req, res) => {
	const subjects = await Subject.find()
	if (subjects) {
		return res.status(200).json(subjects)
	} else {
		return res.status(404).send({ message: "Matéria não encontrado" })
	}
});

app.get("/subject/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const subject = await Subject.findById(id)
		if (subject) {
			return res.status(200).send(subject)
		} else {
			return res.status(404).send({ message: 'Nenhuma matéria encontrada!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

app.delete("/subject/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const user = await Subject.findByIdAndDelete(id)
		if (user) {
			return res.status(200).send({ message: 'Matéria removido com sucesso!' })
		} else {
			return res.status(404).send({ message: 'Nenhuma matéria removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

module.exports = app;