import { ClientTable } from "@/components/client-table/table";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export type Client = {
  id: string;
  code: string;
  address: string;
  state: string;
  cityCode: string | null;
  name: string;
  tradeName: string | null;
  neighborhood: string | null;
  zipCode: string | null;
  city: string;
  areaCode: string | null;
  phone: string | null;
  type: string;
  email: string | null;
  country: string | null;
  taxId: string;
  openingDate: string;
  homepage: string | null;
  storeCode: string;
  authorId: string;
};

export function ClientsPage() {
  const [data, setData] = useState<Client[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    (async () => {
      setIsPending(true);
      await api
        .get("/client/list")
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsPending(false);
        });
    })();
  }, []);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await api.get("/client/report", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_clientes.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar relatório Excel:", error);
      alert("Falha ao gerar relatório Excel.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="container mx-auto py-8 bg-white mt-10 px-4 rounded-md shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-600 bg-blue-100 rounded-lg w-fit px-2">
          Seus Clientes
        </h1>
        <button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingReport ? "Gerando Relatório..." : "Gerar Relatório Excel"}
        </button>
      </div>
      <ClientTable data={data} isLoading={isPending} />
    </div>
  );
}