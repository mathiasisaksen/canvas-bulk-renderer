import axios from "axios";
import { ConcurrencyManager } from 'axios-concurrency';

const api = axios.create();

//const manager = ConcurrencyManager(api, 20);

export default api;

/*let fetcher = axios.create({
  baseURL: "http://localhost:"
})*/