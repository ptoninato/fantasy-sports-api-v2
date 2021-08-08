import pg from 'pg';

const pool = new pg.Pool();

pool.on('connect', () => {
  console.log('connected');
});

export default pool;
