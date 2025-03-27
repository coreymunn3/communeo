"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/api/swagger")
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Loading API documentation...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="swagger-container">
      <SwaggerUI spec={spec} />
      <style jsx global>{`
        .swagger-container {
          margin: 0;
          padding: 0;
        }
        .swagger-ui .info .title {
          font-size: 2.5rem;
        }
        .swagger-ui .opblock-tag {
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
}
