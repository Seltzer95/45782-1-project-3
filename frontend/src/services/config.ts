class Config {
    public API_URL = "http://localhost:3020/api";
    public SOCKET_URL = "http://localhost:3020";
    
    public getImageUrl(imagePath: string): string {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `http://localhost:3020/${imagePath}`;
    }
}

export const appConfig = new Config();