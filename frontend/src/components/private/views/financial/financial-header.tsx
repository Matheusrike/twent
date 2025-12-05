'use client';

import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, AlertCircle, Container } from 'lucide-react';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { IconChartBar } from '@tabler/icons-react';

export function FinancialHeader() {
    const [branches, setBranches] = useState([]);
    const [totalCurrent, setTotalCurrent] = useState(0);
    const [sold, setSold] = useState(0);
    useEffect(() => {
        async function fetchBranches() {
            try {
                const responseInventory = await fetch('/response/api/inventory', {
                    method: 'GET',
                    credentials: 'include',
                });
                const responseSales = await fetch('/response/api/sale', {
                    method: 'GET',
                    credentials: 'include',
                });
                const inventoryData = await responseInventory.json();
                const salesData = await responseSales.json();
                setBranches(inventoryData.data.data || []);
                let totalCurrent = 0;
                inventoryData.data.map((inventoryProduct: any) => {
                    totalCurrent += inventoryProduct.quantity;
                    return;
                });
                let sold = 0;
                salesData.data.map((saleProducts: any) => {
                    saleProducts.items.map((saleProduct: any) => {
                        sold += saleProduct.quantity;
                        return;
                    });

                    return;
                });
                setTotalCurrent(totalCurrent!);
                setSold(sold);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        }
        fetchBranches();
    }, []);
    return (
        <Card className="flex flex-col h-full w-full">
            <CardContent className="flex items-center justify-between w-full">
                <div className="flex flex-col text-left">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <IconChartBar className="w-5 h-5 text-primary" />
                        Financeiro
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Controlamento de gastos e vendas
                    </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row justify-center w-full max-w-md">
                    <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estoque atual</span>
                        <span className="text-2xl font-bold text-foreground">{totalCurrent.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">unidades</span>
                    </div>

                    <div className="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center flex-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Produtos vendidos
                        </span>
                        <span className="text-2xl font-bold text-foreground">{sold.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">unidades</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
