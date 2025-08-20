import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { db } from '../src/db/in-memory.db';
import { ResolutionsEnum } from '../src/videos/types/video';
import { HttpStatus } from '../src/core/types/http-statuses';

const app = setupApp(express());

describe('Videos API', () => {
  beforeEach(() => {
    db.videos = [];
  });

  it('greets on root route', async () => {
    await request(app).get('/').expect(HttpStatus.Ok).expect('Hello world!');
  });

  it('handles full CRUD flow', async () => {
    await request(app).get('/videos').expect(HttpStatus.Ok, []);

    const createData = {
      title: 'test video',
      author: 'author',
      availableResolutions: [ResolutionsEnum.P720],
    };
    const createRes = await request(app)
      .post('/videos')
      .send(createData)
      .expect(HttpStatus.Created);
    const id = createRes.body.id;

    await request(app).get(`/videos/${id}`).expect(HttpStatus.Ok);

    const updateData = {
      title: 'updated',
      author: 'new author',
      availableResolutions: [ResolutionsEnum.P720],
      canBeDownloaded: false,
      minAgeRestriction: 16,
      publicationDate: new Date().toISOString(),
    };
    await request(app)
      .put(`/videos/${id}`)
      .send(updateData)
      .expect(HttpStatus.NoContent);

    const updated = await request(app)
      .get(`/videos/${id}`)
      .expect(HttpStatus.Ok);
    expect(updated.body).toMatchObject({
      title: updateData.title,
      author: updateData.author,
      canBeDownloaded: updateData.canBeDownloaded,
      minAgeRestriction: updateData.minAgeRestriction,
      availableResolutions: updateData.availableResolutions,
      publicationDate: updateData.publicationDate,
    });

    await request(app).delete(`/videos/${id}`).expect(HttpStatus.NoContent);

    await request(app).get(`/videos/${id}`).expect(HttpStatus.NotFound);
  });

  it('validates input on create', async () => {
    const res = await request(app)
      .post('/videos')
      .send({})
      .expect(HttpStatus.BadRequest);
    expect(res.body.errorsMessages.length).toBeGreaterThan(0);
  });
});
