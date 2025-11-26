"use client";
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Search, Plus, Minus, DollarSign, X, CheckCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Pdv() {
  const [query, setQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const products: Product[] = [
    { id: 1, name: "Produto A", price: 10.50, category: "Eletrônicos" },
    { id: 2, name: "Produto B", price: 20.00, category: "Roupas" },
    { id: 3, name: "Produto C", price: 30.75, category: "Alimentos" },
    { id: 4, name: "Produto D", price: 15.90, category: "Eletrônicos" },
    { id: 5, name: "Produto E", price: 45.00, category: "Roupas" },
    { id: 6, name: "Produto F", price: 8.50, category: "Alimentos" },
  ];

  // Foco automático no campo de busca
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setQuery("");
    searchInputRef.current?.focus();
  }

  function updateQuantity(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleFinalizeSale() {
    if (cart.length === 0) return;
    setShowPayment(true);
  }

  function processPayment() {
    const payment = parseFloat(paymentAmount);
    if (payment >= total) {
      setShowSuccess(true);
      setTimeout(() => {
        setCart([]);
        setShowPayment(false);
        setShowSuccess(false);
        setPaymentAmount("");
        searchInputRef.current?.focus();
      }, 2000);
    }
  }

  const change = parseFloat(paymentAmount) - total;

  return (
    <div className="grid grid-cols-3 gap-6 p-6 min-h-screen bg-background">
      {/* Lista de produtos */}
      <Card className="col-span-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-background rounded-lg p-2 border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar produto (pressione Enter)..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && filtered.length > 0) {
                  addToCart(filtered[0]);
                }
              }}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((p) => (
                <Card
                  key={p.id}
                  className="p-4 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                  onClick={() => addToCart(p)}
                >
                  <div className="text-xs text-primary font-semibold mb-1">
                    {p.category}
                  </div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-xl text-primary font-semibold mt-2">
                    R$ {p.price.toFixed(2)}
                  </p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Carrinho */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-primary" /> Carrinho
            </h2>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Total de itens</p>
            <p className="text-2xl font-bold text-primary">{itemCount}</p>
          </div>

          <ScrollArea className="h-[calc(100vh-450px)] pr-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Carrinho vazio</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded-lg mb-3 bg-card"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {item.price.toFixed(2)} × {item.quantity}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 ml-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          <div className="border-t pt-4 space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total da Venda</p>
              <p className="text-3xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </p>
            </div>
            
            <Button
              className="w-full text-lg py-6"
              onClick={handleFinalizeSale}
              disabled={cart.length === 0}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Finalizar Venda
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Pagamento */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6 space-y-4">
              {showSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    Venda Finalizada!
                  </h3>
                  <p className="text-muted-foreground">
                    Troco: R$ {change.toFixed(2)}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold">Pagamento</h3>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total a pagar</p>
                    <p className="text-3xl font-bold text-primary">
                      R$ {total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Valor Recebido
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="text-xl text-center font-semibold"
                      autoFocus
                    />
                  </div>
                  {paymentAmount && parseFloat(paymentAmount) >= total && (
                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Troco</p>
                      <p className="text-2xl font-bold text-primary">
                        R$ {change.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowPayment(false);
                        setPaymentAmount("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={processPayment}
                      disabled={!paymentAmount || parseFloat(paymentAmount) < total}
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