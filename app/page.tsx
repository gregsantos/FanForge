import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Shield, Users, Zap, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Create derivative content with confidence using official brand assets and clear legal frameworks.",
    },
    {
      icon: Palette,
      title: "Official Assets",
      description: "Access high-quality brand assets including characters, backgrounds, logos, and more.",
    },
    {
      icon: Users,
      title: "Creator Community",
      description: "Join a community of creators working with top brands to produce amazing content.",
    },
    {
      icon: Zap,
      title: "Easy Creation",
      description: "Intuitive drag-and-drop canvas makes it simple to compose your creative vision.",
    },
  ]

  const benefits = [
    "Express creativity legally with official brand approval",
    "Build portfolio with sanctioned derivative works",
    "Connect directly with brand teams and get feedback",
    "Earn recognition and potential compensation",
    "Access exclusive asset kits and creative briefs",
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              Sanctioned Fan Content Platform
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Create with{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Official Brand Assets
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              FanForge connects creators with brands through sanctioned derivative content creation. 
              Express your creativity legally while building your portfolio with official assets.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8">
                  Start Creating Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Explore Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose FanForge?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The only platform designed specifically for sanctioned fan content creation.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Transform Your Passion Into Approved Artworks
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of creators who have found their voice through official brand collaborations. 
                Build your portfolio, gain recognition, and create without legal worries.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                    <span className="ml-3 text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg">
                    Join the Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Palette className="mx-auto h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Creation Canvas Preview
                    </h3>
                    <p className="text-muted-foreground max-w-xs">
                      Intuitive drag-and-drop interface for composing your creative vision
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Start Creating?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join FanForge today and turn your creative passion into officially recognized artwork.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}