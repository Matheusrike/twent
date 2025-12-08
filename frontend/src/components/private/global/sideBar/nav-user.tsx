'use client';

import {
	IconLogout,
	IconUserCircle,
	IconChevronRight,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function NavUser({}) {
	const { isMobile } = useSidebar();

	const router = useRouter();

	// get name and email functions
	const [user, setUser] = useState({
		first_name: '',
		last_name: '',
		email: '',
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch('/response/api/user/me', {
					method: 'GET',
					credentials: 'include',
				});

				if (!res.ok) return;

				const { data } = await res.json();

				setUser({
					first_name: data.first_name,
					last_name: data.last_name,
					email: data.email,
				});
			} catch (err) {
				console.error('Erro ao buscar dados do usuário', err);
			}
		};

		fetchUser();
	}, []);

	// logout functions
	const logout = async () => {
		try {
			await fetch('/response/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});

			return true;
		} catch (err) {
			console.error('Erro ao fazer logout:', err);
			return false;
		}
	};

	const handleLogout = async () => {
		const ok = await logout();

		if (ok) router.push('/companies/login');
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="group hover:bg-accent transition-all duration-200 data-[state=open]:bg-accent"
						>
							<Avatar className="h-9 w-9 rounded-full border-none transition-all duration-200">
								<AvatarFallback className="rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white font-semibold">
									{(user?.first_name?.[0] ?? '') +
										(user?.last_name?.[0] ?? '')}
								</AvatarFallback>
							</Avatar>

							<div className="flex flex-1 flex-col text-left">
								<span className="truncate font-semibold text-sm">
									{user.first_name} {user.last_name}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>

							<IconChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-64 rounded-xl shadow-lg border"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={8}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-3 p-3 bg-accent/50 rounded-t-xl">
								<Avatar className="h-12 w-12 rounded-full">
									<AvatarFallback className="rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white font-semibold text-base">
										{(user?.first_name?.[0] ?? '') +
											(user?.last_name?.[0] ?? '')}
									</AvatarFallback>
								</Avatar>

								<div className="flex flex-1 flex-col min-w-0">
									<span className="truncate font-semibold text-sm">
										{user.first_name} {user.last_name}
									</span>
									<span className="truncate text-xs text-muted-foreground">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<div className="p-1">
							<Link href="/private/profile">
								<DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
									<IconUserCircle className="h-4 w-4" />
									<span className="font-medium">
										Minha Conta
									</span>
								</DropdownMenuItem>
							</Link>

							<DropdownMenuSeparator className="my-1" />

							<DropdownMenuItem
								onClick={handleLogout}
								className="cursor-pointer rounded-lg py-2.5 text-red-600"
							>
								<IconLogout className="h-4 w-4" />
								<span className="font-medium">Sair</span>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
