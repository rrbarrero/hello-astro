import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export class Repository<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  private client: AxiosInstance;

  /**
   * @param resourcePath
   * @param baseURL
   */
  constructor(
    private resourcePath: string,
    baseURL: string = 'http://localhost:8000/'
  ) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getAll(): Promise<T[]> {
    const resp: AxiosResponse<T[]> = await this.client.get(this.resourcePath + '/');
    return resp.data;
  }

  async getById(id: number | string): Promise<T> {
    const resp: AxiosResponse<T> = await this.client.get(`${this.resourcePath}/${id}/`);
    return resp.data;
  }

  async create(dto: CreateDto): Promise<T> {
    const resp: AxiosResponse<T> = await this.client.post(this.resourcePath + '/', dto);
    return resp.data;
  }

  async update(id: number | string, dto: UpdateDto): Promise<T> {
    const resp: AxiosResponse<T> = await this.client.put(
      `${this.resourcePath}/${id}/`,
      dto
    );
    return resp.data;
  }

  async delete(id: number | string): Promise<void> {
    await this.client.delete(`${this.resourcePath}/${id}/`);
  }
}
