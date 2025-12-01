"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Trash2,
  Search,
  Plus,
  Minus,
  DollarSign,
  X,
  CheckCircle,
} from "lucide-react";

interface Product {
  sku: string;
  name: string;
  price: string;
  image?: string;
}

interface InventoryItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
  image?: string;
}

export default function Pdv() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<InventoryItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "pix" | "debito" | "credito" | ""
  >("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        const res = await fetch("/response/api/inventory/store", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar estoque");

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Dados inválidos");
        }

        setAllProducts(json.data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o estoque. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      setFilteredProducts([]);
      return;
    }

    const filtered = allProducts.filter((item) => {
      const name = item.product.name.toLowerCase();
      const sku = item.product.sku.toLowerCase();
      return name.includes(q) || sku.includes(q);
    });

    setFilteredProducts(filtered);
  }, [query, allProducts]);

  const addToCart = (item: InventoryItem) => {
    const stock = item.quantity;
    const p = item.product;

    if (stock < 1) {
      alert("Produto sem estoque!");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);

      if (exists) {
        if (exists.quantity + 1 > stock) {
          alert(`Estoque insuficiente! Apenas ${stock} disponíveis.`);
          return prev;
        }
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      const newItem: CartItem = {
        id: item.id,
        name: p.name,
        price: parseFloat(p.price),
        quantity: 1,
        availableStock: stock,
        image: p.image,
      };

      return [...prev, newItem];
    });

    setQuery("");
    inputRef.current?.focus();
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              if (newQty > item.availableStock) {
                alert(`Estoque máximo: ${item.availableStock}`);
                return item;
              }
              return newQty <= 0 ? null : { ...item, quantity: newQty };
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const finalizeSale = () => {
    if (cart.length === 0) return;
    setShowPayment(true);
  };

  const processPayment = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);

    try {
      for (const item of cart) {
        const res = await fetch(`/api/inventory/remove/${item.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erro ao baixar estoque");
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => {
          setCart([]);
          setShowPayment(false);
          setShowSuccess(false);
          setPaymentMethod("");
          inputRef.current?.focus();
        }, 2500);
      }, 1500);
    } catch (err: any) {
      alert("Erro ao finalizar venda: " + err.message);
      setIsProcessing(false);
    }
  };

  const paymentLabels = {
    pix: "PIX",
    debito: "Débito",
    credito: "Crédito",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-background ">
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 border rounded-lg p-2 mb-3 bg-white">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              ref={inputRef}
              placeholder="Buscar por nome ou SKU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-center text-sm">
              {error}
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-180px)]">
            {loading && (
              <p className="text-center py-16 text-muted-foreground">
                Carregando estoque...
              </p>
            )}

            {!loading && filteredProducts.length === 0 && query && (
              <p className="text-center py-16 text-muted-foreground text-sm">
                Nenhum produto encontrado para "{query}"
              </p>
            )}

            <div className="space-y-2">
              {filteredProducts.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-5 flex  items-center">
                    <div className="flex gap-4">
                      {/* Imagem Quadrada Grande */}
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-36 h-36 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-lg w-36 h-36 flex-shrink-0" />
                      )}

                      {/* Informações do Produto */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <p className="text-base text-muted-foreground mb-1">
                          SKU: {item.product.sku}
                        </p>
                        <h3 className="font-semibold uppercase text-base line-clamp-2 mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm font-medium uppercase font-semibold ">
                          Estoque: {item.quantity}
                        </p>
                        <p className="text-3xl font-bold text-primary mt-2">
                          R$ {parseFloat(item.product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Carrinho
            </h2>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="text-red-600 h-8 text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Limpar
              </Button>
            )}
          </div>

          <div className="text-center py-2.5 bg-primary/10 rounded-lg mb-2.5">
            <p className="text-[10px] text-muted-foreground">Itens</p>
            <p className="text-2xl font-bold">{itemCount}</p>
          </div>

          <ScrollArea className="flex-1 my-2">
            {cart.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">
                Carrinho vazio
              </p>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2.5 border rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        R$ {item.price.toFixed(2)} un
                      </p>
                      <p className="text-base font-bold text-primary">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={() =>
                          setCart((c) => c.filter((i) => i.id !== item.id))
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t pt-3 space-y-2.5">
            <div className="text-center py-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground">Total da venda</p>
              <p className="text-3xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </p>
            </div>
            <Button
              size="lg"
              className="w-full text-base h-11"
              onClick={finalizeSale}
              disabled={cart.length === 0}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Finalizar Venda
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              {showSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-600">
                    Venda concluída!
                  </h2>
                  <p className="text-muted-foreground mt-3 text-sm">
                    Redirecionando ao PDV...
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xl">Processando pagamento...</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-center mb-6">
                    Forma de pagamento
                  </h3>
                  <div className="text-center py-6 bg-primary/10 rounded-lg mb-6">
                    <p className="text-4xl font-bold">R$ {total.toFixed(2)}</p>
                  </div>

                  <div className="grid gap-3">
                    {(["pix", "debito", "credito"] as const).map((method) => (
                      <Button
                        key={method}
                        variant={
                          paymentMethod === method ? "default" : "outline"
                        }
                        size="lg"
                        className="text-lg h-14"
                        onClick={() => setPaymentMethod(method)}
                      >
                        {paymentLabels[method]}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => setShowPayment(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 text-lg h-12"
                      onClick={processPayment}
                      disabled={!paymentMethod || isProcessing}
                    >
                      Confirmar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
