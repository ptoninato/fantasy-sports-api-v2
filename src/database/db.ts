import pg from 'pg';

const pool = new pg.Pool();

pool.on('connect', () => {
  console.log('connected');
});

pool.on('error', (err) => {console.log(err)});

export default pool;
