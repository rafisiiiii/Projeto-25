import { Label } from "@radix-ui/react-label";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Eye,
  Trash,
  AlertTriangle,
  Loader2,
  Building2,
  User,
  Phone,
  MapPinHouse,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { useNavigate } from "react-router";
import {
  cn,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatPhone,
  STATES,
} from "@/lib/utils";
import type { Client } from "@/pages/clients";
import ReactDOM from "react-dom";
import { Separator } from "../ui/separator";
import { useRequester } from "@/hooks/use-requester";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editClientSchema,
  type EditClientSchema,
} from "../_register-client-form/schema";
import { RHFForm } from "../rhf/rhf-form";
import { RHFInput } from "../rhf/rhf-input";
import { RHFSelect } from "../rhf/rhf-select";

interface ClientTableProps {
  data: Client[];
  isLoading: boolean;
}

export function ClientTable({ data, isLoading }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [tipoPessoaFilter, setTipoPessoaFilter] = React.useState<string>("all");
  const [deleteUser, setDeleteUser] = useState("");
  const [client, setClient] = useState<Client | null>(null);

  const navigate = useNavigate();

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      if (tipoPessoaFilter !== "all" && item.type !== tipoPessoaFilter) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          (item.tradeName || "").toLowerCase().includes(searchLower) ||
          (item.taxId || "").includes(searchTerm) ||
          (item.email || "").toLowerCase().includes(searchLower) ||
          item.city.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [data, searchTerm, tipoPessoaFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDocument = (doc: string) => {
    if (doc.length === 11) {
      return formatCPF(doc);
    } else if (doc.length === 14) {
      return formatCNPJ(doc);
    }
    return doc;
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
            <Input
              type="search"
              placeholder="Buscar por nome, CNPJ, email..."
              className="pl-9  focus-visible:ring-blue-200 focus-visible:border-blue-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="tipoPessoa"
                className="text-sm whitespace-nowrap bg-zinc-200 px-2  rounded-sm">
                Tipo do cadastro:
              </Label>
              <Select
                value={tipoPessoaFilter}
                onValueChange={(value) => {
                  setTipoPessoaFilter(value);
                  setCurrentPage(1);
                }}>
                <SelectTrigger
                  id="tipoPessoa"
                  className="w-[140px]  focus:ring-blue-500">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="F">Física</SelectItem>
                  <SelectItem value="J">Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/register-client")}
                className=" bg-blue-500 hover:bg-blue-400 text-white ">
                Cadastrar novo cliente
              </Button>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-zinc-200 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    CNPJ/CPF
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    Nome/Razão Social
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    Nome Fantasia
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    Cidade/UF
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    Contato
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    Tipo
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-600">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="w-full h-30 flex items-center justify-center">
                        <Loader2 className="animate-spin text-zinc-400" />
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 font-semibold">
                        {item.taxId
                          ? formatDocument(item.taxId)
                          : "Não informado"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 ">
                        <p className="bg-zinc-100 px-2 py-1 rounded-md font-semibold w-fit">
                          {item.name}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600">
                        {item.tradeName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-600 font-semibold">
                        {item.city}/{item.state}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600">
                        {!item.phone && !item.email ? (
                          "Não informado"
                        ) : (
                          <>
                            <div className="font-semibold">
                              {item.areaCode &&
                                item.phone &&
                                formatPhone(item.areaCode + item.phone)}
                            </div>
                            <div className="text-blue-500 leading-3">
                              {item.email}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            item.type === "F"
                              ? "border-blue-200 border-2 text-blue-500 bg-blue-50 font-semibold"
                              : "border-purple-200 border-2 text-purple-500 bg-purple-50 font-semibold"
                          }>
                          {
                            {
                              "": "Não definido",
                              J: "Pessoa Jurídica",
                              F: "Pessoa Física",
                            }[item.type || ""]
                          }
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => setClient(item)}
                            variant="outline">
                            <Eye className="text-blue-500" />
                          </Button>
                          <Button
                            onClick={() => setDeleteUser(item.code)}
                            variant="destructive">
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-blue-500">
                      Nenhum resultado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-zinc-600">
            Mostrando{" "}
            <span className="font-medium">
              {filteredData.length > 0
                ? `${startIndex + 1}-${startIndex + paginatedData.length} de ${
                    filteredData.length
                  }`
                : "0"}
            </span>{" "}
            resultados
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Label
                htmlFor="itemsPerPage"
                className="text-sm whitespace-nowrap">
                Por página:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}>
                <SelectTrigger
                  id="itemsPerPage"
                  className="w-[70px] border-zinc-200 focus:ring-blue-500">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-200 text-zinc-600 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              <div className="text-sm text-zinc-600">
                Página {currentPage} de {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-200 text-zinc-600 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}>
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Próxima página</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteClient
        code={deleteUser}
        open={!!deleteUser}
        setOpen={() => setDeleteUser("")}
      />
      {client && (
        <ClientDialog
          open={!!client}
          client={client}
          setOpen={() => setClient(null)}
        />
      )}
    </>
  );
}

interface DialogProps {
  open: boolean;
  children: React.ReactNode;
}

export const Dialog = ({ open, children }: DialogProps) => {
  const [shouldRender, setShouldRender] = useState(() => open);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }, [open]);

  const handleAnimationEnd = () => {
    if (isClosing) {
      setShouldRender(false);
      setIsClosing(false);
    }
  };

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div
      //  onClick={setOpen}
      className="fixed top-0 w-full min-h-screen bg-zinc-800/80 z-50 transition-all">
      <div
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          "absolute shadow top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 z-100 bg-white rounded-md border px-2 pt-2 pb-5",
          isClosing ? "animate-fade-out" : "animate-fade-in"
        )}>
        {children}
      </div>
    </div>,
    document.body
  );
};

interface ConfirmDeleteClientProps {
  code: string;
  open: boolean;
  setOpen: () => void;
}

export const ConfirmDeleteClient = ({
  code,
  open,
  setOpen,
}: ConfirmDeleteClientProps) => {
  const { mutation, isPending } = useRequester({
    mutateFn: (code: string) => api.delete(`/client/${code}`),
    onSuccess: () => {
      setOpen();
      toast.success("Cliente excluído!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Opá, algo deu errado :(");
      console.log(error);
    },
  });

  const handleDelete = () => {
    if (isPending) return;
    mutation(code);
  };

  return (
    <Dialog open={open}>
      <div className="flex flex-col max-w-md w-full ">
        <div className="w-full text-center">
          <h1 className="inline-flex items-center text-xl text-red-500 font-semibold bg-red-200 rounded-lg px-4">
            Importante <AlertTriangle className="ml-2" />
          </h1>
          <h2 className="mt-4 text-base text-zinc-900">
            Tem certeza de que quer excluir o cadastro deste cliente?
          </h2>
          <p className="text-sm text-zinc-600">
            Ao confirmar essa operação, todos os dados do cliente serão
            excluídos de nosso sistema e não poderão ser recuperados.
          </p>
        </div>
        <Separator className="my-3" />
        <div className="inline-flex w-full items-center justify-end gap-2">
          <Button
            disabled={isPending}
            onClick={handleDelete}
            className="bg-blue-500 hover:bg-blue-400">
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? "Excluindo" : "Confirma"}
          </Button>
          <Button
            disabled={isPending}
            onClick={() => setOpen()}
            variant="destructive">
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

interface ClientDialogProps {
  client: Client;
  open: boolean;
  setOpen: () => void;
}

export const ClientDialog = ({ client, open, setOpen }: ClientDialogProps) => {
  const methods = useForm({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      name: client.name || "",
      email: client.email || "",
      phone:
        (client.areaCode && client.phone && client.areaCode + client.phone) ||
        "",
      areaCode: client.areaCode || "",
      homepage: client.homepage || "",
      zipCode: client.zipCode || "",
      neighborhood: client.neighborhood || "",
      address: (client.address && client.address.split("n°")[0]) || "",
      city: client.city || "",
      cityCode: client.cityCode || null,
      country: client.country || null,
      state: client.state || "",
      houseNumber: (client.address && client.address.split("n°")[1]) || "",
    },
  });

  const { mutation, isPending } = useRequester({
    mutateFn: (body: EditClientSchema) =>
      api.patch(`/client/${client.code}`, body),
    onSuccess: () => {
      toast.success("Cliente atualizado!");
      setOpen();
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Opá, algo deu errado :(");
      console.log(error);
    },
  });

  function onSubmit(data: EditClientSchema) {
    if (isPending) return;

    mutation({
      name: data.name,
      email: data.email,
      phone: data.phone,
      areaCode: data.areaCode,
      homepage: data.homepage,
      address: data.address,
      city: data.city,
      cityCode: data.cityCode,
      country: data.country,
      neighborhood: data.neighborhood,
      state: data.state,
      zipCode: data.zipCode,
      houseNumber: data.houseNumber,
    });
  }

  return (
    <Dialog open={open}>
      <div className="flex flex-col min-w-3xl w-full">
        <div className="w-full px-2 pt-5 space-y-2">
          <h1 className="inline-flex items-start text-xl text-purple-500 font-semibold bg-purple-100 rounded-lg px-4">
            {
              {
                J: <Building2 className="mr-2" />,
                F: <User className="mr-2" />,
              }[client.type || "F"]
            }
            {client.name}
          </h1>
          <div className="space-y-1">
            <p className="text-emerald-500 bg-emerald-100 font-semibold px-2 rounded-md w-fit">
              {
                {
                  J: "Pessoa Jurídica",
                  F: "Pessoa Física",
                }[client.type || "F"]
              }
              :
              <span className="ml-2 font-normal">
                {client.taxId.length === 11
                  ? formatCPF(client.taxId)
                  : formatCNPJ(client.taxId)}
              </span>
            </p>
            {client.type === "J" ? (
              <div className="space-y-1 [&_p]:font-semibold [&_p_span]:font-normal">
                <p className="text-sm ">
                  Nome Fantasia:
                  <span className="text-xs ml-2">{client.tradeName}</span>
                </p>
                <p className="text-sm">
                  Data de abertura:
                  <span className="text-xs ml-2">
                    {formatDate(client.openingDate)}
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-1 [&_p]:font-semibold [&_p_span]:font-normal">
                <p className="text-sm">
                  Data de Nascimento:
                  <span className="text-xs ml-2">
                    {formatDate(client.openingDate)}
                  </span>
                </p>
              </div>
            )}
          </div>
          <p className="text-zinc-600 text-sm">
            Atualize as informações do cliente.
          </p>
          <Separator className="my-5" />
          <div className="w-full flex flex-col items-start space-y-2 mt-3">
            <RHFForm methods={methods}>
              <form
                id="edit_client_form"
                onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                  console.log(errors);
                })}
                className="space-y-4 w-full max-h-80 overflow-y-scroll">
                <div className="space-y-2 px-1">
                  <p className="inline-flex items-center text-sm font-semibold gap-2 bg-blue-100 px-2 rounded-md py-1">
                    <User size={16} className="text-blue-500" /> Informações
                    Básica
                  </p>
                  <RHFInput<EditClientSchema>
                    name="name"
                    label="Nome/Razão social"
                    required
                  />
                </div>

                <div className="space-y-2 px-1">
                  <p className="inline-flex items-center text-sm font-semibold gap-2 bg-blue-100 px-2 rounded-md py-1">
                    <Phone size={16} className="text-blue-500" /> Informações de
                    Contato
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <RHFInput<EditClientSchema> name="email" label="Email" />
                      <RHFInput<EditClientSchema>
                        name="phone"
                        mask="phone"
                        label="Telefone"
                      />
                    </div>
                    <div>
                      <RHFInput<EditClientSchema>
                        name="homepage"
                        label="Home"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 px-1">
                  <p className="inline-flex items-center text-sm font-semibold gap-2 bg-blue-100 px-2 rounded-md py-1">
                    <MapPinHouse size={16} className="text-blue-500" /> Endereço
                  </p>

                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                      <RHFInput<EditClientSchema>
                        name="zipCode"
                        label="CEP"
                        mask="cep"
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="col-span-1">
                      <RHFInput<EditClientSchema>
                        name="cityCode"
                        label="Codigo do município"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <RHFInput<EditClientSchema>
                        name="address"
                        label="Endereço"
                      />
                    </div>
                    <RHFInput<EditClientSchema>
                      name="houseNumber"
                      label="Numero da casa"
                      placeholder="n°"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <RHFInput<EditClientSchema>
                      name="neighborhood"
                      label="Bairro"
                    />
                    <RHFInput<EditClientSchema> name="city" label="Cidade" />
                  </div>
                  <div className="grid grid-cols-2 gap-6 items-center">
                    <RHFSelect<EditClientSchema>
                      options={STATES}
                      name="state"
                      label="Estado"
                      placeholder="Selecione o estado"
                    />
                    <RHFInput<EditClientSchema>
                      name="country"
                      label="Pais"
                      placeholder="Selecione o pais"
                    />
                  </div>
                </div>
              </form>
            </RHFForm>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="inline-flex w-full items-center justify-end gap-2">
          <Button
            disabled={
              Object.keys(methods.formState.dirtyFields).length === 0 ||
              isPending
            }
            form="edit_client_form"
            type="submit"
            className="bg-blue-500 hover:bg-blue-400">
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? "Editando" : "Editar"}
          </Button>
          <Button onClick={() => setOpen()} variant="destructive">
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
