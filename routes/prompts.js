const express = require('express');
const Prompt = require('../models/prompt');

module.exports = (pool, redisClient) => {
  const router = express.Router();
  const promptModel = new Prompt(pool);

  const validatePrompt = ({ title, content, complexity }) => {
    const errors = {};

    if (!title || String(title).trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (!content || String(content).trim().length < 20) {
      errors.content = 'Content must be at least 20 characters long';
    }

    const parsedComplexity = Number(complexity);
    if (!Number.isInteger(parsedComplexity) || parsedComplexity < 1 || parsedComplexity > 10) {
      errors.complexity = 'Complexity must be an integer between 1 and 10';
    }

    return {
      errors,
      normalized: {
        title: String(title || '').trim(),
        content: String(content || '').trim(),
        complexity: parsedComplexity,
      },
    };
  };

  router.get('/', async (req, res) => {
    try {
      const prompts = await promptModel.getAll();
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prompts' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { errors, normalized } = validatePrompt(req.body);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const prompt = await promptModel.create(
        normalized.title,
        normalized.content,
        normalized.complexity,
      );

      res.status(201).json(prompt);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create prompt' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await promptModel.getById(id);

      if (!prompt) {
        return res.status(404).json({ error: 'Prompt not found' });
      }

      const viewKey = `prompt:${id}:views`;
      const viewCount = await redisClient.incr(viewKey);

      res.json({
        ...prompt,
        view_count: Number(viewCount) || 0,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prompt' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPrompt = await promptModel.deleteById(id);

      if (!deletedPrompt) {
        return res.status(404).json({ error: 'Prompt not found' });
      }

      await redisClient.del(`prompt:${id}:views`);
      res.json({ message: 'Prompt deleted successfully', prompt: deletedPrompt });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete prompt' });
    }
  });

  return router;
};
