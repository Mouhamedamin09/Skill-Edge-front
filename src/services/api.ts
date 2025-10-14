const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  subscription: {
    plan: string;
    startDate: string;
    endDate: string;
  };
  usage: {
    minutesUsed: number;
    minutesLimit: number;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
  requiresVerification?: boolean;
  email?: string;
  expiresAt?: string;
}

class API {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("token");
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/me");
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Verification endpoints
  async verifyEmail(
    email: string,
    code: string
  ): Promise<{ message: string; token: string; user: User }> {
    return this.request<{ message: string; token: string; user: User }>(
      "/verification/verify-email",
      {
        method: "POST",
        body: JSON.stringify({ email, code }),
      }
    );
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      "/verification/resend-verification",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  }

  // Test endpoint
  async sendTestEmail(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/test/email", {
      method: "POST",
      body: JSON.stringify({ to: email }),
    });
  }
}

export const authAPI = new API();
