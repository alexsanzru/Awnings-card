import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'awnings-card.js',      
  output: {
    file: 'dist/awnings-card.js',
    format: 'es',                
  },
  plugins: [ resolve() ],
};
